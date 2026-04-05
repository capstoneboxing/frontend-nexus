
# BoxerProfileLookupFailureResponse

Response returned when the AI cannot confidently identify a boxer profile

## Properties

Name | Type
------------ | -------------
`boxerFound` | boolean
`confidence` | number
`message` | string

## Example

```typescript
import type { BoxerProfileLookupFailureResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "boxerFound": false,
  "confidence": 0.42,
  "message": Could not confidently match the boxer name to a known professional boxer in the selected weight class,
} satisfies BoxerProfileLookupFailureResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BoxerProfileLookupFailureResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


