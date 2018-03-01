import { DrawingType } from './draw';
import { validator } from './drawing_validator';

let data = [
  {
    type: DrawingType.Above,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    guideLine: {}
  },
  {
    type: DrawingType.At,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    guideLine: {}
  },
  {
    type: DrawingType.Below,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    guideLine: {}
  },
  {
    type: DrawingType.Between,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    height: 0
  },
  {
    type: DrawingType.PathLine,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d'
  },
  {
    type: DrawingType.VerticalGridLine,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d'
  },
  {
    type: DrawingType.HorizontalGridLine,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d'
  },
  {
    type: DrawingType.Plane,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d'
  },
  {
    type: DrawingType.Text,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d'
  }
];

describe( 'drawing validation', () =>
{
  data.forEach( ( testCase, i ) =>
  {
    test( `Test Case: ${i}`, () =>
    {
      expect( validator.validate( 'drawing', testCase ) ).toEqual( true );
      console.log( testCase );
      // expect( data ).toEqual( {
      //   ...data,
      //   color: '#000000'
      // } );
    } );
  } );
} );
