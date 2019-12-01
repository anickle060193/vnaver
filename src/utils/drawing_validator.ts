import Ajv from 'ajv';
import defineKeywords from 'ajv-keywords';

import { Drawing, DrawingType, dashStyles, HorizontalAlign, VerticalAlign, DrawingMap } from 'utils/draw';
import { arrayToMap, mapToArray } from 'utils/utils';

const MIN_COORDINATE = -1000000;
const MAX_COORDINATE = +1000000;

enum Schemas
{
  Color = 'Color',
  DrawingBase = 'DrawingBase',
  LineStyle = 'LineStyle',
  BasicDrawing = 'BasicDrawing',
  BetweenDrawing = 'BetweenDrawing',
  ConnectedEndPoint = 'ConnectedEndPoint',
  FloatingEndPoint = 'FloatingEndPoint',
  ConnectedLine = 'ConnectedLine',
  EndPoint = 'EndPoint',
  PathLineDrawing = 'PathLineDrawing',
  CurvedLineDrawing = 'CurvedLineDrawing',
  VerticalGridLineDrawing = 'VerticalGridLineDrawing',
  HorizontalGridLineDrawing = 'HorizontalGridLineDrawing',
  PlaneDrawing = 'PlaneDrawing',
  HorizontalAlign = 'HorizontalAlign',
  VerticalAlign = 'VerticalAlign',
  TextDrawing = 'TextDrawing',
  Drawing = 'Drawing'
}

function createDrawingSchema( drawingType: DrawingType, schema: Schemas )
{
  return {
    $id: drawingType,
    type: 'object',
    required: [ 'type' ],
    properties: {
      type: { const: drawingType }
    },
    allOf: [
      { $ref: schema }
    ]
  };
}

const drawingTypes: { [ key in DrawingType ]: Schemas } = {
  [ DrawingType.Above ]: Schemas.BasicDrawing,
  [ DrawingType.At ]: Schemas.BasicDrawing,
  [ DrawingType.Below ]: Schemas.BasicDrawing,
  [ DrawingType.Between ]: Schemas.BetweenDrawing,
  [ DrawingType.PathLine ]: Schemas.PathLineDrawing,
  [ DrawingType.CurvedLine ]: Schemas.CurvedLineDrawing,
  [ DrawingType.VerticalGridLine ]: Schemas.VerticalGridLineDrawing,
  [ DrawingType.HorizontalGridLine ]: Schemas.HorizontalGridLineDrawing,
  [ DrawingType.Plane ]: Schemas.PlaneDrawing,
  [ DrawingType.Text ]: Schemas.TextDrawing,
};

export const validator = defineKeywords( new Ajv( {
  allErrors: true,
  useDefaults: true,
  $data: true,
  validateSchema: true,
  verbose: true
} ), 'select' )
  .addSchema( {
    $id: Schemas.Color,
    type: 'string',
    pattern: '^#[0-9a-fA-F]{6}'
  } )
  .addSchema( {
    $id: Schemas.DrawingBase,
    type: 'object',
    required: [ 'id', 'type', 'color' ],
    properties: {
      type: { enum: Object.keys( drawingTypes ) },
      id: { type: 'string', format: 'uuid' },
      color: { $ref: Schemas.Color }
    }
  } )
  .addSchema( {
    $id: Schemas.LineStyle,
    type: 'object',
    required: [ 'dash', 'strokeWidth' ],
    properties: {
      dash: { enum: Object.keys( dashStyles ) },
      strokeWidth: { type: 'number', minimum: 0, maximum: 1000 }
    }
  } )
  .addSchema( {
    $id: Schemas.BasicDrawing,
    type: 'object',
    required: [ 'type', 'x', 'y' ],
    properties: {
      type: { enum: [ DrawingType.Above, DrawingType.At, DrawingType.Below ] },
      x: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      y: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
    },
  } )
  .addSchema( {
    $id: Schemas.BetweenDrawing,
    type: 'object',
    required: [ 'type', 'height' ],
    properties: {
      type: { const: DrawingType.Between },
      height: { type: 'number', minimum: 0, maximum: MAX_COORDINATE }
    },
  } )
  .addSchema( {
    $id: Schemas.ConnectedEndPoint,
    type: 'object',
    required: [ 'connected', 'anchorId', 'topOfBetween', 'startOfPathLine' ],
    properties: {
      connected: { const: true },
      anchorId: { type: 'string', format: 'uuid' },
      topOfBetween: { type: 'boolean' },
      startOfPathLine: { type: 'boolean' }
    }
  } )
  .addSchema( {
    $id: Schemas.FloatingEndPoint,
    type: 'object',
    required: [ 'connected', 'x', 'y' ],
    properties: {
      connected: { const: false },
      x: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      y: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
    }
  } )
  .addSchema( {
    $id: Schemas.EndPoint,
    type: 'object',
    required: [ 'connected' ],
    properties: {
      connected: { type: 'boolean' }
    },
    select: { $data: '0/connected' },
    selectCases: {
      [ true.toString() ]: { $ref: Schemas.ConnectedEndPoint },
      [ false.toString() ]: { $ref: Schemas.FloatingEndPoint },
    },
    selectDefault: false
  } )
  .addSchema( {
    $id: Schemas.ConnectedLine,
    type: 'object',
    required: [ 'start', 'end' ],
    properties: {
      start: { $ref: Schemas.EndPoint },
      end: { $ref: Schemas.EndPoint }
    }
  } )
  .addSchema( {
    $id: Schemas.PathLineDrawing,
    type: 'object',
    required: [ 'type' ],
    properties: {
      type: { const: DrawingType.PathLine }
    },
    allOf: [
      { $ref: Schemas.DrawingBase },
      { $ref: Schemas.ConnectedLine },
      { $ref: Schemas.LineStyle }
    ]
  } )
  .addSchema( {
    $id: Schemas.CurvedLineDrawing,
    type: 'object',
    required: [ 'type' ],
    properties: {
      type: { const: DrawingType.CurvedLine }
    },
    allOf: [
      { $ref: Schemas.DrawingBase },
      { $ref: Schemas.ConnectedLine },
      { $ref: Schemas.LineStyle }
    ]
  } )
  .addSchema( {
    $id: Schemas.VerticalGridLineDrawing,
    type: 'object',
    required: [ 'type', 'x' ],
    properties: {
      type: { const: DrawingType.VerticalGridLine },
      x: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
    },
    allOf: [
      { $ref: Schemas.DrawingBase },
      { $ref: Schemas.LineStyle }
    ]
  } )
  .addSchema( {
    $id: Schemas.HorizontalGridLineDrawing,
    type: 'object',
    required: [ 'type', 'y' ],
    properties: {
      type: { const: DrawingType.HorizontalGridLine },
      y: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
    },
    allOf: [
      { $ref: Schemas.DrawingBase },
      { $ref: Schemas.LineStyle }
    ]
  } )
  .addSchema( {
    $id: Schemas.PlaneDrawing,
    type: 'object',
    required: [ 'type', 'x', 'y', 'size', 'rotation' ],
    properties: {
      type: { const: DrawingType.Plane },
      x: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      y: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      size: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      rotation: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
    },
    allOf: [
      { $ref: Schemas.DrawingBase }
    ]
  } )
  .addSchema( {
    $id: Schemas.HorizontalAlign,
    enum: Object.keys( HorizontalAlign )
  } )
  .addSchema( {
    $id: Schemas.VerticalAlign,
    enum: Object.keys( VerticalAlign )
  } )
  .addSchema( {
    $id: Schemas.TextDrawing,
    type: 'object',
    required: [ 'type', 'x', 'y', 'horizontalAlign', 'verticalAlign', 'text', 'fontSize' ],
    properties: {
      type: { const: DrawingType.Text },
      x: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      y: { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      horizontalAlign: { enum: Object.keys( HorizontalAlign ) },
      verticalAlign: { enum: Object.keys( VerticalAlign ) },
      text: { type: 'string' },
      fontSize: { type: 'number', minimum: 0, maximum: 1000 }
    },
    allOf: [
      { $ref: Schemas.DrawingBase }
    ]
  } );

Object.entries( drawingTypes ).forEach( ( [ drawingType, schema ] ) =>
{
  validator.addSchema( createDrawingSchema( drawingType as DrawingType, schema ) );
} );

let selectCases: { [ key: string ]: { $ref: DrawingType } } = {};
Object.keys( drawingTypes ).forEach( ( drawingType ) =>
{
  selectCases[ drawingType as DrawingType ] = { $ref: drawingType as DrawingType };
} );

validator
  .addSchema( {
    $id: Schemas.Drawing,
    type: 'object',
    required: [ 'type' ],
    properties: {
      type: { enum: Object.keys( drawingTypes ) },
    },
    select: { $data: '0/type' },
    selectCases: selectCases,
    selectDefault: false
  } );

( window as any ).validator = validator; // tslint:disable-line no-any

export interface DrawingsParseResult
{
  drawings?: DrawingMap;
  errors?: string[];
}

export function parseDrawings( drawingsJson: string ): DrawingsParseResult
{
  let error: Error | null = null;
  try
  {
    let parsedDrawings = JSON.parse( drawingsJson );

    if( !Array.isArray( parsedDrawings ) )
    {
      return {
        errors: [ 'Parsed drawings are not an array.' ]
      };
    }

    let drawings: Drawing[] = [];
    let errors: string[] = [];
    ( parsedDrawings as Array<{}> ).forEach( ( parsedDrawing, i ) =>
    {
      if( validator.validate( Schemas.Drawing, parsedDrawing ) )
      {
        drawings.push( parsedDrawing as Drawing );
      }
      else
      {
        errors.push( `There was an error with drawing ${i}: ${validator.errorsText()}` );
      }
    } );

    let drawingMap = arrayToMap( drawings );

    validatePathLineDrawings( drawingMap, errors );

    return { drawings: drawingMap, errors };
  }
  catch( e )
  {
    console.error( 'Failed to parse drawings:', e, drawingsJson );
    error = e;
  }

  return {
    errors: [ error ? error.toString() : 'Failed to parse drawings.' ]
  };
}

function validatePathLineDrawings( drawings: DrawingMap, errors: string[] )
{
  let removedIds: string[] = [];

  for( let drawing of mapToArray( drawings ) )
  {
    if( drawing.type === DrawingType.PathLine )
    {
      if( drawing.start.connected )
      {
        let anchor = drawings[ drawing.start.anchorId ];
        if( !anchor )
        {
          removedIds.push( drawing.id );
          errors.push( `Drawing {${drawing.id}} removed as start-point connected anchor drawing (${drawing.start.anchorId}) does not exist.` );
        }
        else if( anchor.id === drawing.id )
        {
          removedIds.push( drawing.id );
          errors.push( `Drawing {${drawing.id}} removed due to circular reference.` );
        }
      }

      if( drawing.end.connected )
      {
        let anchor = drawings[ drawing.end.anchorId ];
        if( !anchor )
        {
          removedIds.push( drawing.id );
          errors.push( `Drawing {${drawing.id}} removed as end-point connected anchor drawing (${drawing.end.anchorId}) does not exist.` );
        }
        else if( anchor.id === drawing.id )
        {
          removedIds.push( drawing.id );
          errors.push( `Drawing {${drawing.id}} removed due to circular reference.` );
        }
      }
    }
  }

  let firstRemovalPass = true;
  while( removedIds.length > 0 )
  {
    let removedId = removedIds.pop()!;

    delete drawings[ removedId ];

    if( !firstRemovalPass )
    {
      errors.push( `Drawing {${removedId}} removed due to removal of dependent drawing.` );
    }

    for( let drawing of mapToArray( drawings ) )
    {
      if( drawing.type === DrawingType.PathLine )
      {
        if( ( drawing.start.connected && drawing.start.anchorId === removedId )
          || ( drawing.end.connected && drawing.end.anchorId === removedId ) )
        {
          removedIds.push( drawing.id );
        }
      }
    }

    firstRemovalPass = false;
  }
}
