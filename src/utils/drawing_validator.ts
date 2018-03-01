import * as Ajv from 'ajv';

import { Drawing, DrawingType, dashStyles, LineDashStyle } from 'utils/draw';

function createDrawingSchema( drawingType: DrawingType, properties: {} )
{
  return {
    $id: drawingType,
    type: 'object',
    required: [ 'id', 'type', 'color', ...Object.keys( properties ) ],
    properties: {
      'type': { const: drawingType },
      'id': { type: 'string', format: 'uuid' },
      'color': { $ref: 'color', default: '#000000' },
      ...properties
    }
  };
}

const lineStyleSchema = {
  type: 'object',
  default: {},
  required: [ 'dash', 'strokeWidth' ],
  properties: {
    'dash': { enum: Object.keys( dashStyles ), default: LineDashStyle.Solid },
    'strokeWidth': { type: 'number', minimum: 0, maximum: 1000, default: 1 }
  }
};

const guideLineProperties = {
  'showGuideLine': { type: 'boolean', default: true },
  'guideLine': lineStyleSchema
};

const drawingTypes: {[ key in DrawingType ]: {} } = {
  [ DrawingType.Above ]: guideLineProperties,
  [ DrawingType.At ]: guideLineProperties,
  [ DrawingType.Below ]: guideLineProperties,
  [ DrawingType.Between ]: {
    'height': { type: 'number', default: 0, minimum: 0, maximum: 10000 },
    ...guideLineProperties
  },
  [ DrawingType.PathLine ]: {},
  [ DrawingType.VerticalGridLine ]: {},
  [ DrawingType.HorizontalGridLine ]: {},
  [ DrawingType.Plane ]: {},
  [ DrawingType.Text ]: {},
};

export const validator = new Ajv( { allErrors: true, useDefaults: true } )
  .addSchema( { type: 'string' }, 'string' )
  .addSchema( { type: 'boolean' }, 'boolean' )
  .addSchema( { type: 'number' }, 'number' )
  .addFormat( 'color', /^#[0-9a-fA-F]{6}/ )
  .addSchema( { type: 'string', format: 'color' }, 'color' );

Object.entries( drawingTypes ).forEach( ( [ drawingType, properties ]: [ DrawingType, {} ] ) =>
{
  validator.addSchema( createDrawingSchema( drawingType, properties ) );
} );

validator.addSchema( {
  $id: 'drawing',
  type: 'object',
  anyOf: Object.keys( drawingTypes ).map( ( drawingType ) => ( { $ref: drawingType } ) )
} );

console.log( JSON.stringify( validator.getSchema( 'Above' ).schema, null, 2 ) );

validator
  .addSchema( {
    type: 'array',
    items: { $ref: 'drawing' }
  }, 'drawings' );

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
