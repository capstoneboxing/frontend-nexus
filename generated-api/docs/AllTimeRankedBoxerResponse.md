
# AllTimeRankedBoxerResponse

Response containing a ranked all-time boxer profile used in a generation batch

## Properties

Name | Type
------------ | -------------
`rankedBoxerId` | number
`batchId` | number
`weightClassId` | number
`boxerName` | string
`rankingPosition` | number
`heightCm` | number
`reachCm` | number
`weightClassAlignment` | number
`handSpeed` | number
`footSpeed` | number
`strength` | number
`endurance` | number
`reactionTime` | number
`punchAccuracy` | number
`punchVariety` | number
`defensiveGuardEfficiency` | number
`headMovement` | number
`footworkTechnique` | number
`counterpunchingAbility` | number
`combinationEfficiency` | number
`ringIq` | number
`adaptabilityMidFight` | number
`distanceControl` | number
`tempoControl` | number
`opponentPatternRecognition` | number
`fightPlanningDiscipline` | number
`composureUnderPressure` | number
`aggressionControl` | number
`mentalToughness` | number
`focusConsistency` | number
`resilienceAfterKnockdown` | number
`winRatio` | number
`knockoutRatio` | number
`titleFightExperience` | number
`strengthOfOpposition` | number
`recentFightActivity` | number
`performanceConsistency` | number
`sourceNote` | string
`generatedAt` | Date

## Example

```typescript
import type { AllTimeRankedBoxerResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "rankedBoxerId": 1,
  "batchId": 1,
  "weightClassId": 11,
  "boxerName": Sugar Ray Leonard,
  "rankingPosition": 1,
  "heightCm": 178.0,
  "reachCm": 188.0,
  "weightClassAlignment": 9.2,
  "handSpeed": 9.6,
  "footSpeed": 9.3,
  "strength": 8.8,
  "endurance": 9.1,
  "reactionTime": 9.4,
  "punchAccuracy": 9.5,
  "punchVariety": 9.0,
  "defensiveGuardEfficiency": 8.9,
  "headMovement": 9.2,
  "footworkTechnique": 9.7,
  "counterpunchingAbility": 9.4,
  "combinationEfficiency": 9.1,
  "ringIq": 9.8,
  "adaptabilityMidFight": 9.3,
  "distanceControl": 9.4,
  "tempoControl": 9.1,
  "opponentPatternRecognition": 9.5,
  "fightPlanningDiscipline": 9.0,
  "composureUnderPressure": 9.6,
  "aggressionControl": 8.9,
  "mentalToughness": 9.7,
  "focusConsistency": 9.2,
  "resilienceAfterKnockdown": 9.0,
  "winRatio": 0.89,
  "knockoutRatio": 0.54,
  "titleFightExperience": 9.4,
  "strengthOfOpposition": 9.8,
  "recentFightActivity": 8.1,
  "performanceConsistency": 9.3,
  "sourceNote": Profile generated from widely reported public boxing sources,
  "generatedAt": 2026-03-27T18:30:00Z,
} satisfies AllTimeRankedBoxerResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AllTimeRankedBoxerResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


