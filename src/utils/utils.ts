export function mapToArray<T>( m: { [ key: string ]: T } )
{
  return Object.keys( m ).map( ( key ) => m[ key ] );
}

export function assertNever( x: never ): Error
{
  return new Error( `Invalid case: ${x}` );
}

export function limit( val: number, min: number, max: number )
{
  if( val < min )
  {
    return min;
  }
  else if( val > max )
  {
    return max;
  }
  else
  {
    return val;
  }
}
