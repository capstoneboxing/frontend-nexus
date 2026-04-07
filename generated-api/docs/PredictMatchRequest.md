
# PredictMatchRequest

Match prediction request containing two fighters and the weight class

## Properties

Name | Type
------------ | -------------
`weightClassId` | number
`boxerA` | [BoxerInput](BoxerInput.md)
`boxerB` | [BoxerInput](BoxerInput.md)

## Example

```typescript
import type { PredictMatchRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "weightClassId": null,
  "boxerA": null,
  "boxerB": null,
} satisfies PredictMatchRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PredictMatchRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


