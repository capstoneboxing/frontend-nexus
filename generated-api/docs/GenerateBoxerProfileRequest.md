
# GenerateBoxerProfileRequest

Request to generate a boxer profile using AI for a given boxer name and weight class

## Properties

Name | Type
------------ | -------------
`boxerName` | string
`weightClassId` | number

## Example

```typescript
import type { GenerateBoxerProfileRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "boxerName": Terence Crawford,
  "weightClassId": 11,
} satisfies GenerateBoxerProfileRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GenerateBoxerProfileRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


