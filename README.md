# CS5167 User Interface Project 2: Catalyst Degree Audit Redesign

Group Members: Andrea Dall’Ara, Colin Davis, Jason Bellerjeau, Alex VanBibber

[Hosted on Vercel](cs-5167-project2.vercel.app)

## Advisement Report Page

### The Idea
The advisement report page has been the result of many headaches for students.  Automatic sign outs, buttons with no purpose, impossible to find classes, there is no shortage of problems with the site.  We seek to fix that.

Our interface provides a grid layout of courses, sorted into semesters. This enables a student to more easily parse what courses are in their degree and get a rough idea of their progress. We also provide a set of filters in order to get a glimpse at more specific data such as what courses a student hasn't taken. Additionally, a student can directly click on a requirement/course and view detailed information regardging its description, prerequisites, and which courses can count towards the requirement (for electives).

### Heuristic Assessment
Using Jakob's 10 Usability Heuristics, we noted the following about the current degree audit page:
1. Visibility of the System:
    - Does not easily define what classes need to be taken
    - No clear sign of where the user is in the course path
2. Match Between System and the Real World
    - Uses course numbers before names, some names are changed and not updated
    - No buttons define what requirements are drop down menus
    - No use of color to define what is done or not
3. User Control and Freedom
    - Buttons for different tasks have the same name but do not define what task they affect
    - Redundant buttons that do nothing unless something else is done
4. Consistency and Standards
    - Courses that cannot be applied twice appear at the very top of the site and not where they are really needed
5. Error Prevention
    - Pressing the favorite button locks the user out
    - Mostly reading so no real errors are producable
6. Recognition Rather than Recall
    - What a user needs is off page at times and requires moving around the page
    - Legend symbols are only at the top of the page and not described where they actually appear
7. Flexibility and Efficiency
    - No shortcuts offered
    - Opens many tabs, sucking up resources and confusing users
8. Aesthetic and Minimalist Design
    - Only light mode is offered
    - Too minimal, not enough imagery is shown to show how something works or is applied (ie the legend icons)
9. Recognize, Diagnose, and Recover from Errors
    - Not applicable as errors are very rare (apart from the favorite error which requires a re launch of the page)
10. Help and Documentation
    - Help is offered via advisors
    - Little to no documentation 

### Sketches

Initial Sketch:
![Initial sketch](https://cdn.discordapp.com/attachments/1572327759496216786/1572398293013758032/ui_project_2_sketch_1.jpg?ex=6afe3986&is=6afce806&hm=2ae93af4c0f649aa3345dace9ba288d24adee1a820af8f7071c2c9cb5484c69e&)

SVG Rendering of Initial Sketch:
![SVG Rendering of initial sketch](https://cdn.discordapp.com/attachments/1572327759496216786/1572398292644401292/87a8dd77-c6d7-4635-be84-0c610e167cbb.png?ex=6afe3986&is=6afce806&hm=68e4e0d5e966d01bf4a7240c9faaf219b906d68498d57a140e05b391707e36fb&)

Sketch during discussions of alternative designs and expansions:
![alternative sketch](https://media.discordapp.net/attachments/1572327759496216786/1572389396706103356/20261116_135850.jpg?ex=6afe313d&is=6afcdfbd&hm=f7a592cfd3052ba2b05ae4c368218522687796abbf8608a529df7fafa73c71b5&format=webp&width=768&height=1024)
![second series of alt sketching](https://cdn.discordapp.com/attachments/803318093601308734/1572404397802266765/image.png?ex=6afe3f36&is=6afcedb6&hm=af03eddeae6d4b8c3eabfb28d381b14f912dd5957528fc25c7f6d22d9de7473f&)

Sketch laying out PDF export organization
![PDF sketch](https://media.discordapp.net/attachments/1572327759496216786/1572389397070876845/20261116_135828.jpg?ex=6afe313d&is=6afcdfbd&hm=a7a2ec870cdc21748b8d8bdfd2de0d5e543880f7538268dfa9a953d9e8436892&format=webp&width=768&height=1024)

### Interview Questions

1. Have you ever used the advisement report on catalyst?

2. What do you remember about using Catalyst?

3. Did you accomplish your goal for accessing the Advisement Report?

4. How would you rate Catalyst out of 5 stars?

5. Any other comments about Catalyst?

### Implementation

This project was implemented using Svelte, JavaScript, and CSS along with the following libraries:
- *tailwindcss*: for css utility classes
- *jspdf and jspdf-autotable*: for exporting pdf data
- *lucide*: a standard icon component library
- *sveltekit*: page routing

#### Data Model:

**Assumptions:**

- All cohorts follow the same plan
- All columns are non-null unless specified
- Elective groups are not a thing
  - This is to simplify the data model for the purposes of this project, however this is very doable just more time consuming

**`plan.json`**
| Column | Type |
|---|---|
| `plan_code` | `string` |
| `display` | `string` |

`src/assets/data/plan.json` is a list of plans. A plan currently only consists of a plan code and a display name to show to the user. The plan code must be unique.

**`course.json`**
| Column | Type |
|---|---|
| `course_code` | `string` |
| `course_name` | `string` |
| `credits` | `integer` |
| `description` | `string` |
| `prerequisites` | `string[]` |

`src/assets/data/course.json` is a list of course data, each course includes a unique course code, a course name, and the number of credit hours. The course code must be unique and acts the id/key for the table

**`requirement.json`**
| Column | Type |
|---|---|
| `semester` | `integer` |
| `requirement_id` | `string` |
| `display_name` | `string` |

`src/assets/data/requirement.json` is a list of abstract requirements for a given plan. Requirements can be a course (in which case the requirement id should be the course code) or an elective (in which case the requirement should be a unique descriptive string in screaming snake case for the title of the elective, prepended with the plan code). The requirement ids must be unique. Each requirement also includes a semester field for the semester that the requirement is intended to be taken, this is represented as an integer that starts counting from 1. Elective requirements include a `display_name` field containing a concise, user-facing label for the elective slot. **The `display_name` field will be null for non-elective courses.**

**`requirement_course.json`**
| Column | Type |
|---|---|
| `course_code` | `string` |
| `requirement_id` | `string` |

`src/assets/data/requirement_course.json` acts as a join table between requirements and actual courses. For normal "core" courses, this is just a link between the requirement id and the course code. For electives, there may be multiple entries for a given requirement (still linking to a course code, the requirement id will just show up more than once). The key for this "table" is a compound key between the requirement id and course code.

**`plan_requirement.json`**
| Column | Type |
|---|---|
| `plan_code` | `string` |
| `requirement_id` | `string` |

`src/assets/data/plan_requirement.json` is a list of requirements for a given plan. This "table" acts as a join table between a plan and a requirement. The respective ids should be used for each side. The key for this table is a compound key made up of the plan code and requirement id.

**`student.json`**
| Column | Type |
|---|---|
| `name` | `string` |
| `m_number` | `string` |
| `gpa` | `string` |
| `plan_code` | `string` |
| `semester` | `string` |

`src/assets/data/student.json` is a list of student records. Each record includes the student's name, M number, GPA, plan code, and current semester. The M number identifies the student.

**`student_courses.json`**
| Column | Type |
|---|---|
| `m_number` | `string` |
| `requirement_id` | `string` |
| `status` | `string` |
| `term` | `string` |
| `grade` | `string` |

`src/assets/data/student_courses.json` is a list of a student's status and term for each requirement, with a grade when available. The M number identifies the student, and the requirement id identifies the requirement. The key for this table is a compound key made up of the M number and requirement id. A grade is null until one is available.

#### Future work

- Enable more complex filters for courses (ie expressions like "!MATH" to show all courses that are not under MATH)
- Address one of the weaker assumptions for the data model: elective groups can be modeled recursively with requirements
- Visually draw lines between courses based on their dependencies

### AI usage
LLMs were used in the following capacities:
- SVG renderings of sketches and design mockups
- Debugging and providing assistance with the implementation
  - *NOTE: The bulk of the code written was still human made, LLMs were used as a time saving measure*
- To scrape and generate most of the mock data under `src/assets/data/`.

### Demo
Link: https://youtu.be/jLBgQclkTmc
