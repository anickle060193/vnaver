declare module 'react-konva-custom'
{
  global
  {
    export interface KonvaMouseEvent<T>
    {
      currentTarget: T;
      evt: MouseEvent;
      type: string;
    }
  }
}
