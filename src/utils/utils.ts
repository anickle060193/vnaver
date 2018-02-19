export function mapToArray<T>( m: { [ key: string ]: T } )
{
  return Object.keys( m ).map( ( key ) => m[ key ] );
}

export function assertNever( x: never ): Error
{
  return new Error( `Invalid case: ${x}` );
}
