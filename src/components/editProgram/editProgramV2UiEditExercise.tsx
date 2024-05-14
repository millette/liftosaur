import { h, JSX } from "preact";
import { Exercise } from "../../models/exercise";
import { PlannerProgramExercise } from "../../pages/planner/models/plannerProgramExercise";
import { focusedToStr, IPlannerProgramExercise, IPlannerState, IPlannerUi } from "../../pages/planner/models/types";
import { ISettings, IDayData } from "../../types";
import { ILensDispatch } from "../../utils/useLensReducer";
import { ExerciseImage } from "../exerciseImage";
import { IconHandle } from "../icons/iconHandle";
import { SetNumber } from "./editProgramSets";
import { IconCloseCircleOutline } from "../icons/iconCloseCircleOutline";
import { IconSwap } from "../icons/iconSwap";
import { lb } from "lens-shmens";
import { EditProgramUiWarmups } from "./editProgramUi/editProgramUiWarmups";
import { IPlannerEvalResult } from "../../pages/planner/plannerExerciseEvaluator";
import { EditProgramUiReuseSets } from "./editProgramUi/editProgramUiReuseSets";
import { EditProgramUiAllSetVariations } from "./editProgramUi/editProgramUiAllSetVariations";
import { DropdownMenu, DropdownMenuItem } from "./editProgramUi/editProgramUiDropdownMenu";
import { IconKebab } from "../icons/iconKebab";
import { useState } from "preact/hooks";
import { EditProgramUiHelpers } from "./editProgramUi/editProgramUiHelpers";
import { EditProgramUiGlobals } from "./editProgramUi/editProgramUiGlobals";
import { NumInput } from "./editProgramUi/editProgramUiInputs";

interface IEditProgramV2UiEditExerciseProps {
  evaluatedWeeks: IPlannerEvalResult[][];
  plannerExercise: IPlannerProgramExercise;
  settings: ISettings;
  exerciseLine: number;
  dayData: Required<IDayData>;
  ui: IPlannerUi;
  handleTouchStart?: (e: TouchEvent | MouseEvent) => void;
  plannerDispatch: ILensDispatch<IPlannerState>;
}

export function EditProgramV2UiEditExercise(props: IEditProgramV2UiEditExerciseProps): JSX.Element {
  const { plannerExercise, exerciseLine } = props;
  console.log("Planner exercise", plannerExercise);
  const { week, dayInWeek } = props.dayData;
  const weekIndex = week - 1;
  const dayIndex = dayInWeek - 1;
  const exercise = Exercise.findByName(plannerExercise.name, props.settings.exercises);
  const exerciseType = exercise != null ? { id: exercise.id, equipment: plannerExercise.equipment } : undefined;
  const repeatStr = PlannerProgramExercise.repeatToRangeStr(plannerExercise);
  const lbProgram = lb<IPlannerState>().p("current").p("program");

  const [showMenu, setShowMenu] = useState(false);
  const [showLabel, setShowLabel] = useState(!!plannerExercise.label);
  const [showRepeat, setShowRepeat] = useState(plannerExercise.repeating.length > 0);
  const [showOrder, setShowOrder] = useState(plannerExercise.order !== 0);

  function modify(cb: (ex: IPlannerProgramExercise) => void): void {
    props.plannerDispatch(
      lbProgram.recordModify((program) => {
        return EditProgramUiHelpers.changeCurrentInstance(
          program,
          props.dayData,
          plannerExercise.fullName,
          props.settings,
          cb
        );
      })
    );
  }

  const repeatFrom = plannerExercise.repeating[0] ?? props.dayData.week;
  const repeatTo = plannerExercise.repeating[plannerExercise.repeating.length - 1] ?? props.dayData.week;

  return (
    <div
      className="px-2 py-1 mb-2 bg-orange-100 rounded-lg"
      style={{ border: "1px solid rgb(125 103 189 / 15%)", userSelect: "none", minHeight: "5rem" }}
    >
      <div className="flex items-center">
        <div className="flex items-center flex-1">
          {props.handleTouchStart && (
            <div className="p-2 mr-1 cursor-move" style={{ touchAction: "none" }}>
              <span onMouseDown={props.handleTouchStart} onTouchStart={props.handleTouchStart}>
                <IconHandle />
              </span>
            </div>
          )}
          <div>
            <SetNumber setIndex={props.exerciseLine} />
          </div>
          {repeatStr && <div className="ml-4 text-xs font-bold text-grayv2-main">[{repeatStr}]</div>}
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button
              data-cy="edit-menu-exercise"
              className={`px-1 py-2 nm-edit-menu-exercise`}
              onClick={() => {
                setShowMenu(true);
              }}
            >
              <IconKebab />
            </button>
            {showMenu && (
              <DropdownMenu onClose={() => setShowMenu(false)}>
                <DropdownMenuItem
                  isTop={true}
                  onClick={() => {
                    modify((e) => {
                      if (e.setVariations.length < 2) {
                        e.reuse = undefined;
                        e.globals = {};
                        while (e.setVariations.length < 2) {
                          e.setVariations.push({
                            sets: [
                              {
                                repRange: {
                                  minrep: 1,
                                  maxrep: 1,
                                  isAmrap: false,
                                  isQuickAddSet: false,
                                  numberOfSets: 1,
                                },
                              },
                            ],
                            isCurrent: false,
                          });
                        }
                      } else {
                        e.setVariations.splice(1);
                      }
                    });
                    setShowMenu(false);
                  }}
                >
                  {plannerExercise.setVariations.length > 1 ? "Disable" : "Enable"} Set Variations
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (showLabel) {
                      modify((e) => {
                        e.label = undefined;
                        e.fullName = e.shortName;
                      });
                    }
                    setShowLabel(!showLabel);
                    setShowMenu(false);
                  }}
                >
                  {plannerExercise.label ? "Disable" : "Enable"} Label
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (showRepeat) {
                      modify((e) => {
                        e.repeat = [];
                        e.repeating = [];
                      });
                    }
                    setShowRepeat(!showRepeat);
                    setShowMenu(false);
                  }}
                >
                  {plannerExercise.repeating.length > 0 ? "Disable" : "Enable"} Repeat
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (showOrder) {
                      modify((e) => {
                        e.order = 0;
                      });
                    }
                    setShowOrder(!showOrder);
                    setShowMenu(false);
                  }}
                >
                  {plannerExercise.order !== 0 ? "Disable" : "Enable"} Forced Order
                </DropdownMenuItem>
              </DropdownMenu>
            )}
          </div>
          <div>
            <button
              data-cy="close-edit-exercise"
              className="px-2 align-middle ls-edit-day-v2 button nm-close-edit-exercise"
              onClick={() => {
                props.plannerDispatch(
                  lb<IPlannerState>()
                    .p("ui")
                    .p("exerciseUi")
                    .p("edit")
                    .recordModify((edit) => {
                      const newEdit = new Set(Array.from(edit));
                      const key = focusedToStr({ weekIndex, dayIndex, exerciseLine });
                      newEdit.delete(key);
                      return newEdit;
                    })
                );
              }}
            >
              <IconCloseCircleOutline />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-1">
        {exerciseType && (
          <div className="mr-3">
            <ExerciseImage settings={props.settings} className="w-8" exerciseType={exerciseType} size="small" />
          </div>
        )}
        <div className="flex items-center flex-1 mr-2 text-lg">
          <div>
            {plannerExercise.label ? `${plannerExercise.label}: ` : ""}
            {plannerExercise.name}
          </div>
          <div>
            <button className="w-8 p-2 mr-1 text-center nm-edit-program-v2-expand-collapse-exercise" onClick={() => {}}>
              <IconSwap />
            </button>
          </div>
        </div>
      </div>
      {showLabel && (
        <label className="flex items-center mb-2">
          <span className="mr-2">Label:</span>
          <input
            className="w-full p-1 text-sm text-left border rounded border-grayv2-200"
            value={plannerExercise.label}
            type="text"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              const value = target.value;
              modify((ex) => {
                ex.label = value;
                ex.fullName = `${value}: ${ex.shortName}`;
              });
            }}
          />
        </label>
      )}
      {showRepeat && (
        <label className="flex items-center mb-2">
          <span className="mr-2">Repeat from week {repeatFrom} to week: </span>
          <select
            value={repeatTo}
            onChange={(event) => {
              const target = event.target as HTMLSelectElement;
              const value = target.value;
              const numValue = Number(value);
              if (!isNaN(numValue)) {
                modify((ex) => {
                  if (numValue === repeatFrom) {
                    ex.repeat = [];
                    ex.repeating = [];
                  } else {
                    const result: number[] = [];
                    for (let i = repeatFrom; i <= numValue; i += 1) {
                      result.push(i);
                    }
                    ex.repeat = result;
                    ex.repeating = [...result];
                  }
                });
              }
            }}
          >
            {Array.from({ length: props.evaluatedWeeks.length }, (_, i) => i + 1).map((w) => {
              return (
                <option value={w} selected={repeatTo === w}>
                  {w}
                </option>
              );
            })}
          </select>
        </label>
      )}
      {showOrder && (
        <div className="flex items-center mb-2">
          <span className="mr-2">Forced order: </span>
          <NumInput
            value={plannerExercise.order}
            min={0}
            onUpdate={(val) => {
              if (val != null) {
                modify((ex) => {
                  ex.order = val;
                });
              }
            }}
          />
        </div>
      )}
      <EditProgramUiReuseSets
        plannerDispatch={props.plannerDispatch}
        plannerExercise={plannerExercise}
        settings={props.settings}
        dayData={props.dayData}
        exerciseLine={exerciseLine}
        evaluatedWeeks={props.evaluatedWeeks}
      />
      <EditProgramUiWarmups
        plannerDispatch={props.plannerDispatch}
        plannerExercise={plannerExercise}
        settings={props.settings}
      />
      <EditProgramUiAllSetVariations
        dayData={props.dayData}
        exerciseLine={exerciseLine}
        plannerDispatch={props.plannerDispatch}
        plannerExercise={plannerExercise}
        settings={props.settings}
      />
      {plannerExercise.reuse && plannerExercise.setVariations.length === 0 && (
        <EditProgramUiGlobals
          dayData={props.dayData}
          exerciseLine={exerciseLine}
          plannerDispatch={props.plannerDispatch}
          reuse={plannerExercise.reuse}
          plannerExercise={plannerExercise}
          settings={props.settings}
        />
      )}
    </div>
  );
}
