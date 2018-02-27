import * as Ajv from 'ajv';

import { Drawing, DrawingType } from 'utils/draw';

function createDrawingSchema( drawingType: DrawingType, properties: {} = {} )
{
  return {
    $id: drawingType,
    allOf: [
      { $ref: 'drawing' },
      {
        required: [ 'type', ...Object.keys( properties ) ],
        properties: {
          ...properties,
          'type': { const: drawingType }
        }
      }
    ],
  };
}

const drawingTypes: {[ key in DrawingType ]: {} } = {
  [ DrawingType.Above ]: {},
  [ DrawingType.At ]: {},
  [ DrawingType.Below ]: {},
  [ DrawingType.Between ]: {
    height: { $ref: 'number', default: 0 }
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
  .addSchema( { type: 'string', format: 'color' }, 'color' )
  .addSchema( {
    $id: 'drawing',
    type: 'object',
    required: [ 'type', 'id', 'color' ],
    properties: {
      'type': { enum: Object.keys( drawingTypes ) },
      'id': { type: 'string', format: 'uuid' },
      'color': { $ref: 'color', default: '#000000' }
    }
  } )
  .addSchema( {
    $id: 'guidline',
    type: 'object',
    required:
  } );

Object.entries( drawingTypes ).forEach( ( [ drawingType, props ]: [ DrawingType, {} ] ) =>
{
  validator.addSchema( createDrawingSchema( drawingType, props ) );
} );

validator
  .addSchema( {
    type: 'array',
    items: {
      anyOf: Object.keys( drawingTypes ).map( ( r ) => ( { $ref: r } ) )
    }
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
