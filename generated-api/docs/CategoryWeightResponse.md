
# CategoryWeightResponse

Category weight response

## Properties

Name | Type
------------ | -------------
`weightClassId` | number
`physicalWeight` | number
`technicalWeight` | number
`tacticalWeight` | number
`psychologicalWeight` | number
`experienceWeight` | number

## Example

```typescript
import type { CategoryWeightResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "weightClassId": 11,
  "physicalWeight": 0.2,
  "technicalWeight": 0.25,
  "tacticalWeight": 0.25,
  "psychologicalWeight": 0.15,
  "experienceWeight": 0.15,
} satisfies CategoryWeightResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CategoryWeightResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


