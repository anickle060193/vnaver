import * as Ajv from 'ajv';
import * as defineKeywords from 'ajv-keywords';

import { Drawing, DrawingType, dashStyles, LineDashStyle } from 'utils/draw';

type AllOfs = {}[];

function createDrawingSchema( drawingType: DrawingType, allOfs: AllOfs )
{
  return {
    $id: drawingType,
    type: 'object',
    required: [ 'type' ],
    properties: {
      'type': { const: drawingType }
    },
    allOf: [
      ...allOfs,
      { $ref: 'basicDrawing' }
    ]
  };
}

const drawingTypes: {[ key in DrawingType ]: AllOfs } = {
  [ DrawingType.Above ]: [ { $ref: 'containsGuideLine' } ],
  [ DrawingType.At ]: [ { $ref: 'containsGuideLine' } ],
  [ DrawingType.Below ]: [ { $ref: 'containsGuideLine' } ],
  [ DrawingType.Between ]: [
    { $ref: 'containsGuideLine' },
    {
      type: 'object',
      required: [ 'height' ],
      properties: {
        'height': { type: 'number', default: 0, minimum: 0, maximum: 10000 }
      }
    }
  ],
  [ DrawingType.PathLine ]: [ { $ref: 'lineStyle' } ],
  [ DrawingType.VerticalGridLine ]: [ { $ref: 'lineStyle' } ],
  [ DrawingType.HorizontalGridLine ]: [ { $ref: 'lineStyle' } ],
  [ DrawingType.Plane ]: [],
  [ DrawingType.Text ]: [],
};

export const validator = defineKeywords( new Ajv( { allErrors: true, useDefaults: true, $data: true } ), 'select' )
  .addSchema( { type: 'string' }, 'string' )
  .addSchema( { type: 'boolean' }, 'boolean' )
  .addSchema( { type: 'number' }, 'number' )
  .addFormat( 'color', /^#[0-9a-fA-F]{6}/ )
  .addSchema( { type: 'string', format: 'color' }, 'color' )
  .addSchema( {
    $id: 'basicDrawing',
    type: 'object',
    required: [ 'id', 'type', 'color' ],
    properties: {
      'type': { enum: Object.keys( drawingTypes ) },
      'id': { type: 'string', format: 'uuid' },
      'color': { $ref: 'color', default: '#000000' }
    }
  } )
  .addSchema( {
    $id: 'lineStyle',
    type: 'object',
    required: [ 'dash', 'strokeWidth' ],
    properties: {
      'dash': { enum: Object.keys( dashStyles ), default: LineDashStyle.Solid },
      'strokeWidth': { type: 'number', minimum: 0, maximum: 1000, default: 1 }
    }
  } )
  .addSchema( {
    $id: 'containsGuideLine',
    type: 'object',
    required: [ 'showGuideLine', 'guideLine' ],
    properties: {
      'showGuideLine': { type: 'boolean', default: true },
      'guideLine': { $ref: 'lineStyle', default: {} }
    }
  } );

Object.entries( drawingTypes ).forEach( ( [ drawingType, allOfs ]: [ DrawingType, AllOfs ] ) =>
{
  validator.addSchema( createDrawingSchema( drawingType, allOfs ) );
} );

let selectCases = {
  selectDefault: false
};
Object.keys( drawingTypes ).forEach( ( drawingType ) =>
{
  selectCases[ drawingType ] = { $ref: drawingType };
} );

validator
  .addSchema( {
    $id: 'drawing',
    type: 'object',
    required: [ 'type' ],
    properties: {
      'type': { enum: Object.keys( drawingTypes ) },
    },
    select: { $data: '0/type' },
    selectCases: selectCases
  } )
  .addSchema( {
    $id: 'drawings',
    type: 'array',
    items: { $ref: 'drawing' }
  } );

// console.log( JSON.stringify( validator.getSchema( 'drawing' ).schema, null, 2 ) );
// console.log( JSON.stringify( validator.getSchema( 'Above' ).schema, null, 2 ) );
// console.log( JSON.stringify( validator.getSchema( 'basicDrawing' ).schema, null, 2 ) );
// console.log( JSON.stringify( validator.getSchema( 'containsGuideLine' ).schema, null, 2 ) );
// console.log( JSON.stringify( validator.getSchema( 'lineStyle' ).schema, null, 2 ) );

export function parseDrawings( drawingsJson: string )
{
  try
  {
    let drawings = JSON.parse( drawingsJson );
    let validDrawings = validateDrawings( drawings );
    return validDrawings;
  }
  catch( e )
  {
    console.error( 'Failed to parse drawings:', e, drawingsJson );
  }
  return null;
}

function validateDrawings( drawings: {} ): Drawing[] | null
{
  return null;
}
