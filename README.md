# CS5167 User Interface Project 2: Catalyst Degree Audit Redesign

## Data Model:

### Assumptions:

- All cohorts follow the same plan
- More to follow...

`plan.json`
| Column | Type | Nullable |
|---|---|---|
| `plan_code` | `text` | No |

`src/assets/data/plan.json` is a list of plans. A plan currently only consists of a plan code. The plan code must be unique.

`course.json`
| Column | Type | Nullable |
|---|---|---|
| `course_code` | `text` | No |
| `course_name` | `text` | No |
| `credits` | `integer` | No |

`src/assets/data/course.json` is a list of course data, each course includes a unique course code, a course name, and the number of credit hours. The course code must be unique and acts the id/key for the table

`requirement.json`
| Column | Type | Nullable |
|---|---|---|
| `semester` | `integer` | No |
| `requirement_id` | `text` | No |

`src/assets/data/requirement.json` is a list of abstract requirements for a given plan. Requirements can be a course (in which case the requirement id should be the course code) or an elective (in which case the requirement should be a unique descriptive string in screaming snake case for the title of the elective, prepended with the plan code). The requirement ids must be unique. Each requirement also includes a semester field for the semester that the requirement is intended to be taken, this is represented as an integer that starts counting from 1.

`requirement_course.json`
| Column | Type | Nullable |
|---|---|---|
| `course_code` | `text` | No |
| `requirement_id` | `text` | No |

`src/assets/data/requirement_course.json` acts as a join table between requirements and actual courses. For normal "core" courses, this is just a link between the requirement id and the course code. For electives, there may be multiple entries for a given requirement (still linking to a course code, the requirement id will just show up more than once). The key for this "table" is a compound key between the requirement id and course code.

`plan_requirement.json`
| Column | Type | Nullable |
|---|---|---|
| `plan_code` | `text` | No |
| `requirement_id` | `text` | No |

`src/assets/data/plan_requirement.json` is a list of requirements for a given plan. This "table" acts as a join table between a plan and a requirement. The respective ids should be used for each side. The key for this table is a compound key made up of the plan code and requirement id.

