import { DrawingType, LineDashStyle } from 'utils/draw';
import { validator } from 'utils/drawing_validator';

let data = [
  {
    type: DrawingType.Above,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    showGuideLine: false,
    guideLine: {}
  },
  {
    type: DrawingType.At,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    showGuideLine: false,
    guideLine: {
      dash: LineDashStyle.LooselyDashed
    }
  },
  {
    type: DrawingType.Below,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    showGuideLine: false,
    guideLine: {
      dash: LineDashStyle.LooselyDashed,
      strokeWidth: 100
    }
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
      let result = validator.validate( 'drawing', testCase );
      if( !result )
      {
        console.warn( validator.errorsText() );
      }
      expect( result ).toBe( true );
    } );
  } );
} );

describe( 'drawings validation', () =>
{
  test( 'all drawings', () =>
  {
    let result = validator.validate( 'drawings', data );
    if( !result )
    {
      console.warn( validator.errorsText() );
    }
    expect( result ).toBe( true );
  } );
} );
