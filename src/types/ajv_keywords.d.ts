declare module 'ajv-keywords'
{
  import { Ajv } from 'ajv';

  type AdditionalKeywords =
    | 'typeof'
    | 'instanceof'
    | 'range'
    | 'exclusiveRange'
    | 'switch'
    | 'select'
    | 'selectCases'
    | 'selectDefault'
    | 'patternRequired'
    | 'prohibited'
    | 'deepProperties'
    | 'deepRequired'
    | 'uniqueItemProperties'
    | 'regexp'
    | 'formatMaximum'
    | 'formatMinimum'
    | 'formatExclusiveMaximum'
    | 'formatExclusiveMinimum'
    | 'dynamicDefaults';

  function defineKeywords( ajv: Ajv, include?: AdditionalKeywords | AdditionalKeywords[] ): Ajv;
  export = defineKeywords;
}
