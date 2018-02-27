import { DrawingType } from './draw';
import { validator } from './drawing_validator';

test( 'validator', () =>
{
  let data = [
    {
      type: DrawingType.Above,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    },
    {
      type: DrawingType.At,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    },
    {
      type: DrawingType.Below,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    },
    {
      type: DrawingType.Between,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    },
    {
      type: DrawingType.PathLine,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    },
    {
      type: DrawingType.VerticalGridLine,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    },
    {
      type: DrawingType.HorizontalGridLine,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    },
    {
      type: DrawingType.Plane,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    },
    {
      type: DrawingType.Text,
      id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      height: 0
    }
  ];
  expect( validator.validate( 'drawings', data ) ).toEqual( true );
  // expect( data ).toEqual( {
  //   ...data,
  //   color: '#000000'
  // } );
} );
