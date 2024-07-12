import React, { useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";

function App() {
  const initialAttributes = ATTRIBUTE_LIST.reduce((acc, attr) => {
    acc[attr] = 10; // Initialize attributes to 10
    return acc;
  }, {});

  const initialSkills = SKILL_LIST.reduce((acc, skill) => {
    acc[skill.name] = 0;
    return acc;
  }, {});

  const initialCharacter = {
    attributes: { ...initialAttributes },
    skills: { ...initialSkills },
    selectedClass: null,
    skillCheck: {
      skill: "",
      dc: 10,
      rollResult: null,
      isSuccessful: null,
    },
  };

  const [characters, setCharacters] = useState([initialCharacter]);

  const incrementAttribute = (charIndex, attr) => {
    // Check if incrementing will exceed the maximum limit of 70
    if (characters[charIndex].attributes[attr] < 70) {
      // Update characters state
      setCharacters((prevChars) => {
        const updatedChars = [...prevChars];
        updatedChars[charIndex] = {
          ...updatedChars[charIndex],
          attributes: {
            ...updatedChars[charIndex].attributes,
            [attr]: updatedChars[charIndex].attributes[attr] + 1,
          },
        };
        return updatedChars;
      });
    }
  };

  const decrementAttribute = (charIndex, attr) => {
    // Update characters state
    setCharacters((prevChars) => {
      const updatedChars = [...prevChars];
      updatedChars[charIndex] = {
        ...updatedChars[charIndex],
        attributes: {
          ...updatedChars[charIndex].attributes,
          [attr]:
            updatedChars[charIndex].attributes[attr] > 0
              ? updatedChars[charIndex].attributes[attr] - 1
              : 0,
        },
      };
      return updatedChars;
    });
  };

  const calculateModifier = (value) => {
    return Math.floor((value - 10) / 2);
  };

  const meetsClassRequirements = (charIndex, className) => {
    const classRequirements = CLASS_LIST[className];
    return ATTRIBUTE_LIST.every(
      (attr) =>
        characters[charIndex].attributes[attr] >= classRequirements[attr]
    );
  };

  const totalSkillPoints = (charIndex) =>
    10 + 4 * calculateModifier(characters[charIndex].attributes.Intelligence);

  const incrementSkill = (charIndex, skillName) => {
    const totalPointsSpent = Object.values(characters[charIndex].skills).reduce(
      (sum, points) => sum + points,
      0
    );
    // Check if total points spent is less than total points available
    if (totalPointsSpent < totalSkillPoints(charIndex)) {
      // Update characters state
      setCharacters((prevChars) => {
        const updatedChars = [...prevChars];
        updatedChars[charIndex] = {
          ...updatedChars[charIndex],
          skills: {
            ...updatedChars[charIndex].skills,
            [skillName]: updatedChars[charIndex].skills[skillName] + 1,
          },
        };
        return updatedChars;
      });
    }
  };

  const decrementSkill = (charIndex, skillName) => {
    // Update characters state
    setCharacters((prevChars) => {
      const updatedChars = [...prevChars];
      updatedChars[charIndex] = {
        ...updatedChars[charIndex],
        skills: {
          ...updatedChars[charIndex].skills,
          [skillName]:
            updatedChars[charIndex].skills[skillName] > 0
              ? updatedChars[charIndex].skills[skillName] - 1
              : 0,
        },
      };
      return updatedChars;
    });
  };

  const toggleSelectedClass = (charIndex, className) => {
    if (characters[charIndex].selectedClass === className) {
      // Deselect if already selected
      setCharacters((prevChars) => {
        const updatedChars = [...prevChars];
        updatedChars[charIndex] = {
          ...updatedChars[charIndex],
          selectedClass: null,
        };
        return updatedChars;
      });
    } else {
      // Select if not selected
      setCharacters((prevChars) => {
        const updatedChars = [...prevChars];
        updatedChars[charIndex] = {
          ...updatedChars[charIndex],
          selectedClass: className,
        };
        return updatedChars;
      });
    }
  };

  const handleSkillChange = (charIndex, skill) => {
    setCharacters((prevChars) => {
      const updatedChars = [...prevChars];
      updatedChars[charIndex] = {
        ...updatedChars[charIndex],
        skillCheck: {
          ...updatedChars[charIndex].skillCheck,
          skill,
        },
      };
      return updatedChars;
    });
  };

  const handleDCChange = (charIndex, dc) => {
    setCharacters((prevChars) => {
      const updatedChars = [...prevChars];
      updatedChars[charIndex] = {
        ...updatedChars[charIndex],
        skillCheck: {
          ...updatedChars[charIndex].skillCheck,
          dc,
        },
      };
      return updatedChars;
    });
  };

  const rollDice = () => {
    return Math.floor(Math.random() * 20) + 1; // Roll a random number between 1 and 20
  };

  const handleRoll = (charIndex) => {
    const { skill, dc } = characters[charIndex].skillCheck;
    const skillModifier = calculateModifier(
      characters[charIndex].attributes[
        SKILL_LIST.find((s) => s.name === skill).attributeModifier
      ]
    );
    const totalSkill = characters[charIndex].skills[skill] + skillModifier;
    const rollResult = rollDice();
    const isSuccessful = totalSkill + rollResult >= dc;
    setCharacters((prevChars) => {
      const updatedChars = [...prevChars];
      updatedChars[charIndex] = {
        ...updatedChars[charIndex],
        skillCheck: {
          ...updatedChars[charIndex].skillCheck,
          rollResult,
          isSuccessful,
        },
      };
      return updatedChars;
    });
  };

  const addCharacter = () => {
    setCharacters((prevChars) => [...prevChars, { ...initialCharacter }]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        {characters.map((character, index) => (
          <div key={index}>
            <h2>Character {index + 1}</h2>
            <section>
              <h3>Skill Check</h3>
              <div>
                <label>Skill:</label>
                <select
                  value={character.skillCheck.skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                >
                  <option value="">Select Skill</option>
                  {SKILL_LIST.map((skill) => (
                    <option key={skill.name} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>DC:</label>
                <input
                  type="number"
                  value={character.skillCheck.dc}
                  onChange={(e) => handleDCChange(index, e.target.value)}
                />
              </div>
              <button onClick={() => handleRoll(index)}>Roll</button>
              {character.skillCheck.rollResult !== null && (
                <div>
                  <p>
                    Random Number Generated: {character.skillCheck.rollResult}
                  </p>
                  <p>
                    {character.skillCheck.isSuccessful
                      ? "Skill Check Successful!"
                      : "Skill Check Failed!"}
                  </p>
                </div>
              )}
            </section>
            <div className="app-section">
              <section>
                {ATTRIBUTE_LIST.map((attr) => (
                  <div key={`${attr}-${index}`}>
                    <span>
                      {attr}: {character.attributes[attr]}
                    </span>
                    <button
                      onClick={() => incrementAttribute(index, attr)}
                      disabled={character.attributes[attr] === 70}
                    >
                      +
                    </button>
                    <button onClick={() => decrementAttribute(index, attr)}>
                      -
                    </button>
                    <span>
                      {" "}
                      Modifier: {calculateModifier(character.attributes[attr])}
                    </span>
                  </div>
                ))}
              </section>
              <section>
                <h3>Classes</h3>
                {Object.keys(CLASS_LIST).map((className) => (
                  <div
                    key={className}
                    onClick={() => toggleSelectedClass(index, className)} // Toggle selected class
                    style={{
                      cursor: "pointer",
                      color: meetsClassRequirements(index, className)
                        ? "green"
                        : "red",
                      fontWeight:
                        character.selectedClass === className
                          ? "bold"
                          : "normal", // Highlight selected class
                    }}
                  >
                    {className}
                  </div>
                ))}
                {character.selectedClass && (
                  <div>
                    <h4>{character.selectedClass} Requirements</h4>
                    <ul>
                      {ATTRIBUTE_LIST.map((attr) => (
                        <li key={`${attr}-${index}`}>
                          {attr}: {CLASS_LIST[character.selectedClass][attr]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
              <section>
                <h3>Skills</h3>
                <p>
                  Total Points Available:{" "}
                  {totalSkillPoints(index) -
                    Object.values(character.skills).reduce(
                      (sum, points) => sum + points,
                      0
                    )}
                </p>
                {SKILL_LIST.map((skill) => {
                  const attributeModifier = calculateModifier(
                    character.attributes[skill.attributeModifier]
                  );
                  const totalSkillValue =
                    character.skills[skill.name] + attributeModifier;
                  return (
                    <div key={`${skill.name}-${index}`}>
                      <span>
                        {skill.name} - Points: {character.skills[skill.name]}
                      </span>
                      <button
                        onClick={() => incrementSkill(index, skill.name)}
                        disabled={
                          Object.values(character.skills).reduce(
                            (sum, points) => sum + points,
                            0
                          ) >= totalSkillPoints(index)
                        }
                      >
                        +
                      </button>
                      <button onClick={() => decrementSkill(index, skill.name)}>
                        -
                      </button>
                      <span>
                        {" "}
                        Modifier ({skill.attributeModifier}):{" "}
                        {attributeModifier}
                      </span>
                      <span> Total: {totalSkillValue}</span>
                    </div>
                  );
                })}
              </section>
            </div>
          </div>
        ))}
        <button onClick={addCharacter}>Add Character</button>
      </section>
    </div>
  );
}

export default App;
