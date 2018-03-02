import * as Ajv from 'ajv';
import DefineKeywords from 'ajv-keywords';

const defineKeywords = require( 'ajv-keywords' ) as typeof DefineKeywords;

import { Drawing, DrawingType, dashStyles, HorizontalAlign, VerticalAlign } from 'utils/draw';

const MIN_COORDINATE = -1000000;
const MAX_COORDINATE = +1000000;

const enum Schemas
{
  Array = 'Array',
  Color = 'Color',
  DrawingBase = 'DrawingBase',
  LineStyle = 'LineStyle',
  ContainsGuideLineDrawing = 'ContainsGuideLineDrawing',
  BasicDrawing = 'BasicDrawing',
  BetweenDrawing = 'BetweenDrawing',
  ConnectedPathLineEndPoint = 'ConnectedPathLineEndPoint',
  FloatingPathLineEndPoint = 'FloatingPathLineEndPoint',
  EndPoint = 'EndPoint',
  PathLineDrawing = 'PathLineDrawing',
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
      'type': { const: drawingType }
    },
    allOf: [
      { $ref: schema }
    ]
  };
}

const drawingTypes: {[ key in DrawingType ]: Schemas } = {
  [ DrawingType.Above ]: Schemas.BasicDrawing,
  [ DrawingType.At ]: Schemas.BasicDrawing,
  [ DrawingType.Below ]: Schemas.BasicDrawing,
  [ DrawingType.Between ]: Schemas.BetweenDrawing,
  [ DrawingType.PathLine ]: Schemas.PathLineDrawing,
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
    $id: Schemas.Array,
    type: 'array'
  } )
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
      'type': { enum: Object.keys( drawingTypes ) },
      'id': { type: 'string', format: 'uuid' },
      'color': { $ref: Schemas.Color }
    }
  } )
  .addSchema( {
    $id: Schemas.LineStyle,
    type: 'object',
    required: [ 'dash', 'strokeWidth' ],
    properties: {
      'dash': { enum: Object.keys( dashStyles ) },
      'strokeWidth': { type: 'number', minimum: 0, maximum: 1000 }
    }
  } )
  .addSchema( {
    $id: Schemas.ContainsGuideLineDrawing,
    type: 'object',
    required: [ 'showGuideLine', 'guideLine' ],
    properties: {
      'showGuideLine': { type: 'boolean' },
      'guideLine': { $ref: Schemas.LineStyle }
    },
    allOf: [
      { $ref: Schemas.DrawingBase }
    ]
  } )
  .addSchema( {
    $id: Schemas.BasicDrawing,
    type: 'object',
    required: [ 'type', 'x', 'y' ],
    properties: {
      'type': { enum: [ DrawingType.Above, DrawingType.At, DrawingType.Below ] },
      'x': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      'y': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
    },
    allOf: [
      { $ref: Schemas.ContainsGuideLineDrawing }
    ]
  } )
  .addSchema( {
    $id: Schemas.BetweenDrawing,
    type: 'object',
    required: [ 'type', 'height' ],
    properties: {
      'type': { const: DrawingType.Between },
      'height': { type: 'number', minimum: 0, maximum: MAX_COORDINATE }
    }
  } )
  .addSchema( {
    $id: Schemas.ConnectedPathLineEndPoint,
    type: 'object',
    required: [ 'connected', 'anchorId', 'topOfBetween', 'startOfPathLine' ],
    properties: {
      'connected': { const: true },
      'anchorId': { type: 'string', format: 'uuid' },
      'topOfBetween': { type: 'boolean' },
      'startOfPathLine': { type: 'boolean' }
    }
  } )
  .addSchema( {
    $id: Schemas.FloatingPathLineEndPoint,
    type: 'object',
    required: [ 'connected', 'x', 'y' ],
    properties: {
      'connected': { const: false },
      'x': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      'y': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
    }
  } )
  .addSchema( {
    $id: Schemas.EndPoint,
    type: 'object',
    required: [ 'connected' ],
    properties: {
      'connected': { type: 'boolean' }
    },
    select: { $data: '0/connected' },
    selectCases: {
      [ true.toString() ]: { $ref: Schemas.ConnectedPathLineEndPoint },
      [ false.toString() ]: { $ref: Schemas.FloatingPathLineEndPoint },
    },
    selectDefault: false
  } )
  .addSchema( {
    $id: Schemas.PathLineDrawing,
    type: 'object',
    required: [ 'type', 'start', 'end' ],
    properties: {
      'type': { const: DrawingType.PathLine },
      'start': { $ref: Schemas.EndPoint },
      'end': { $ref: Schemas.EndPoint }
    },
    allOf: [
      { $ref: Schemas.DrawingBase },
      { $ref: Schemas.LineStyle }
    ]
  } )
  .addSchema( {
    $id: Schemas.VerticalGridLineDrawing,
    type: 'object',
    required: [ 'type', 'x' ],
    properties: {
      'type': { const: DrawingType.VerticalGridLine },
      'x': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
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
      'type': { const: DrawingType.HorizontalGridLine },
      'y': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
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
      'type': { const: DrawingType.Plane },
      'x': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      'y': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      'size': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      'rotation': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE }
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
      'type': { const: DrawingType.Text },
      'x': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      'y': { type: 'number', minimum: MIN_COORDINATE, maximum: MAX_COORDINATE },
      'horizontalAlign': { enum: Object.keys( HorizontalAlign ) },
      'verticalAlign': { enum: Object.keys( VerticalAlign ) },
      'text': { type: 'string' },
      'fontSize': { type: 'number', minimum: 0, maximum: 1000 }
    },
    allOf: [
      { $ref: Schemas.DrawingBase }
    ]
  } );

Object.entries( drawingTypes ).forEach( ( [ drawingType, schema ]: [ DrawingType, Schemas ] ) =>
{
  validator.addSchema( createDrawingSchema( drawingType, schema ) );
} );

let selectCases = {};
Object.keys( drawingTypes ).forEach( ( drawingType ) =>
{
  selectCases[ drawingType ] = { $ref: drawingType };
} );

validator
  .addSchema( {
    $id: Schemas.Drawing,
    type: 'object',
    required: [ 'type' ],
    properties: {
      'type': { enum: Object.keys( drawingTypes ) },
    },
    select: { $data: '0/type' },
    selectCases: selectCases,
    selectDefault: false
  } );

export interface DrawingsParseResult
{
  drawings?: Drawing[];
  errors?: string[];
}

export function parseDrawings( drawingsJson: string ): DrawingsParseResult
{
  let error: Error | null = null;
  try
  {
    let parsedDrawings = JSON.parse( drawingsJson );
    if( !validator.validate( Schemas.Array, parsedDrawings ) )
    {
      return {
        errors: [ 'Parsed drawings are not an array.' ]
      };
    }

    let drawings: Drawing[] = [];
    let errors: string[] = [];
    ( parsedDrawings as {}[] ).forEach( ( parsedDrawing, i ) =>
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
    return { drawings, errors };
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
