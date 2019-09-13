## Version 1.0.0
> - Added async callback methods and releasing polished version.

## Version 0.1.27
> - Substore identifiers can be any string, removing restrictions.
## Version 0.1.26
> - Fixing an IE 11 issue (substore) where Object.assign was not found. Using custom deep copy method instead.
## Version 0.1.25
> - Fixing an IE 11 issue where Object.assign was not found. Using custom deep copy method instead.
## Version 0.1.24
> - Fixing an issue on notifying subscribers, where it would notify a subscriber even after they unsubscribed.
## Version 0.1.23
> - Added rollback to a specific substore.

## Version 0.1.22
> - Bug fix on unsubscribeFrom in substore.

## Version 0.1.21
> - Added hasSubStore method in substore.
> - Subscribers get their own copy of the state.

## Version 0.1.20
> - Added Substores
> - Fixed Rollback.
> - Added unit tests line coverage and branching coverage on stateful to 100%.
> - Updated ES2015 compiler to newer Babel. (No more deprecated packages.)
