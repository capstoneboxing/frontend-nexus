
# PredictionHistoryResponse

Prediction history response

## Properties

Name | Type
------------ | -------------
`predictionId` | number
`boxerAName` | string
`boxerBName` | string
`predictedWinner` | string
`matchWinner` | string
`matchWinMethod` | string
`weightClassId` | number
`boxerAClosenessScore` | number
`boxerBClosenessScore` | number
`probabilityA` | number
`probabilityB` | number
`breakdownSnapshot` | { [key: string]: object; }
`predictionDate` | Date

## Example

```typescript
import type { PredictionHistoryResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "predictionId": 1,
  "boxerAName": Floyd Mayweather Jr.,
  "boxerBName": Manny Pacquiao,
  "predictedWinner": BOXER_A,
  "matchWinner": BOXER_A,
  "matchWinMethod": DECISION,
  "weightClassId": 11,
  "boxerAClosenessScore": 0.8,
  "boxerBClosenessScore": 0.86,
  "probabilityA": 0.48,
  "probabilityB": 0.52,
  "breakdownSnapshot": null,
  "predictionDate": 2026-03-27T18:30:00Z,
} satisfies PredictionHistoryResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PredictionHistoryResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


