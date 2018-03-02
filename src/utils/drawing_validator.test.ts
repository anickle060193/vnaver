import { DrawingType, LineDashStyle, HorizontalAlign, VerticalAlign } from 'utils/draw';
import { validator } from 'utils/drawing_validator';

let data = [
  {
    type: DrawingType.Above,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    showGuideLine: false,
    guideLine: {
      dash: LineDashStyle.LooselyDashed,
      strokeWidth: 100
    },
    x: 0,
    y: 0
  },
  {
    type: DrawingType.At,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    showGuideLine: false,
    guideLine: {
      dash: LineDashStyle.LooselyDashed,
      strokeWidth: 100
    },
    x: 0,
    y: 0
  },
  {
    type: DrawingType.Below,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    showGuideLine: true,
    guideLine: {
      dash: LineDashStyle.LooselyDashed,
      strokeWidth: 100
    },
    x: 0,
    y: 0
  },
  {
    type: DrawingType.Between,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    height: 0,
    x: 0,
    y: 0
  },
  {
    type: DrawingType.PathLine,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    dash: LineDashStyle.LooselyDashed,
    strokeWidth: 100,
    start: {
      connected: true,
      anchorId: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
      topOfBetween: false,
      startOfPathLine: false
    },
    end: {
      connected: false,
      x: 100,
      y: -1000
    }
  },
  {
    type: DrawingType.VerticalGridLine,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    x: 12345,
    dash: LineDashStyle.LooselyDashed,
    strokeWidth: 100
  },
  {
    type: DrawingType.HorizontalGridLine,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    y: 12345,
    dash: LineDashStyle.LooselyDashed,
    strokeWidth: 100
  },
  {
    type: DrawingType.Plane,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    x: 12345,
    y: 12345,
    size: 10034,
    rotation: -1342
  },
  {
    type: DrawingType.Text,
    id: '35fbb386-4d65-4918-8f77-8cb43aa8581d',
    color: '#000000',
    x: 12345,
    y: 12345,
    horizontalAlign: HorizontalAlign.Center,
    verticalAlign: VerticalAlign.Bottom,
    text: 'This is a sentence for the text drawing',
    fontSize: 123
  }
];

describe( 'drawing validation', () =>
{
  data.forEach( ( testCase, i ) =>
  {
    test( `Test Case: ${testCase.type}`, () =>
    {
      let result = validator.validate( 'Drawing', testCase );
      if( !result )
      {
        console.warn( validator.errorsText() );
      }
      expect( result ).toBe( true );
    } );
  } );
} );
