
# PredictionResponse


## Properties

Name | Type
------------ | -------------
`predictionId` | number
`boxerAName` | string
`boxerBName` | string
`predictedWinner` | string
`weightClassId` | number
`closenessA` | number
`closenessB` | number
`probabilityA` | number
`probabilityB` | number
`explanation` | string
`predictionDate` | Date

## Example

```typescript
import type { PredictionResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "predictionId": null,
  "boxerAName": null,
  "boxerBName": null,
  "predictedWinner": null,
  "weightClassId": null,
  "closenessA": null,
  "closenessB": null,
  "probabilityA": null,
  "probabilityB": null,
  "explanation": null,
  "predictionDate": null,
} satisfies PredictionResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PredictionResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


