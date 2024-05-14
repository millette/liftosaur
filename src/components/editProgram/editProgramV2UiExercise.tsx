import { lb } from "lens-shmens";
import { h, JSX, Fragment } from "preact";
import { Exercise } from "../../models/exercise";
import { PlannerProgramExercise } from "../../pages/planner/models/plannerProgramExercise";
import { focusedToStr, IPlannerProgramExercise, IPlannerState, IPlannerUi } from "../../pages/planner/models/types";
import { IDayData, ISettings } from "../../types";
import { StringUtils } from "../../utils/string";
import { ILensDispatch } from "../../utils/useLensReducer";
import { ExerciseImage } from "../exerciseImage";
import { GroupHeader } from "../groupHeader";
import { HistoryRecordSet } from "../historyRecordSets";
import { IconArrowDown2 } from "../icons/iconArrowDown2";
import { IconArrowRight } from "../icons/iconArrowRight";
import { IconDuplicate2 } from "../icons/iconDuplicate2";
import { IconEditSquare } from "../icons/iconEditSquare";
import { IconHandle } from "../icons/iconHandle";
import { IconTrash } from "../icons/iconTrash";
import { SetNumber } from "./editProgramSets";

interface IEditProgramV2UiExerciseProps {
  plannerExercise: IPlannerProgramExercise;
  settings: ISettings;
  dayData: Required<IDayData>;
  exerciseLine: number;
  ui: IPlannerUi;
  handleTouchStart?: (e: TouchEvent | MouseEvent) => void;
  plannerDispatch: ILensDispatch<IPlannerState>;
}

export function EditProgramV2UiExercise(props: IEditProgramV2UiExerciseProps): JSX.Element {
  const { plannerExercise, exerciseLine } = props;
  const { week, dayInWeek } = props.dayData;
  const weekIndex = week - 1;
  const dayIndex = dayInWeek - 1;
  const exercise = Exercise.findByName(plannerExercise.name, props.settings.exercises);
  const exerciseType = exercise != null ? { id: exercise.id, equipment: plannerExercise.equipment } : undefined;
  const warmupSets =
    PlannerProgramExercise.warmups(plannerExercise) ||
    (exercise != null ? PlannerProgramExercise.defaultWarmups(exercise, props.settings) : []);
  const displayWarmupSets = PlannerProgramExercise.warmupSetsToDisplaySets(warmupSets);
  const isCollapsed = props.ui.exerciseUi.collapsed.has(focusedToStr({ weekIndex, dayIndex, exerciseLine }));
  const reusingSets = plannerExercise.reuse?.fullName;
  const repeatStr = PlannerProgramExercise.repeatToRangeStr(plannerExercise);
  const progress = plannerExercise.properties.find((p) => p.name === "progress");
  const update = plannerExercise.properties.find((p) => p.name === "update");
  return (
    <div
      className="px-2 py-1 mb-2 rounded-lg bg-purplev2-100"
      style={{ border: "1px solid rgb(125 103 189 / 15%)", minHeight: "5rem" }}
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
        <div className="">
          <button
            data-cy="edit-exercise"
            className="px-2 align-middle ls-edit-day-v2 button nm-edit-day-v2"
            onClick={() => {
              props.plannerDispatch(
                lb<IPlannerState>()
                  .p("ui")
                  .p("exerciseUi")
                  .p("edit")
                  .recordModify((edit) => {
                    const newEdit = new Set(Array.from(edit));
                    const key = focusedToStr({ weekIndex, dayIndex, exerciseLine });
                    newEdit.add(key);
                    return newEdit;
                  })
              );
            }}
          >
            <IconEditSquare />
          </button>
          <button
            data-cy="clone-exercise"
            className="px-2 align-middle ls-clone-day-v2 button nm-clone-day-v2"
            onClick={() => {
              const newName = StringUtils.nextName(plannerExercise.name);
            }}
          >
            <IconDuplicate2 />
          </button>
          <button
            data-cy={`delete-day-v2`}
            className="px-2 align-middle ls-delete-day-v2 button nm-delete-day-v2"
            onClick={() => {
              if (confirm("Are you sure?")) {
              }
            }}
          >
            <IconTrash />
          </button>
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
            <button
              className="w-8 p-2 mr-1 text-center nm-edit-program-v2-expand-collapse-exercise"
              onClick={() => {
                props.plannerDispatch(
                  lb<IPlannerState>()
                    .p("ui")
                    .p("exerciseUi")
                    .p("collapsed")
                    .recordModify((collapsed) => {
                      const newCollapsed = new Set(Array.from(collapsed));
                      const key = focusedToStr({ weekIndex, dayIndex, exerciseLine });
                      if (newCollapsed.has(key)) {
                        newCollapsed.delete(key);
                      } else {
                        newCollapsed.add(key);
                      }
                      return newCollapsed;
                    })
                );
              }}
            >
              {isCollapsed ? <IconArrowRight className="inline-block" /> : <IconArrowDown2 className="inline-block" />}
            </button>
          </div>
        </div>
      </div>
      {!isCollapsed && (
        <>
          <div className="px-1">
            {PlannerProgramExercise.setVariations(plannerExercise).map((_, i) => {
              const sets = PlannerProgramExercise.sets(plannerExercise, i);
              const hasCurrentSets = !!plannerExercise.setVariations[i]?.sets;
              const globals = plannerExercise.globals;
              const displayGroups = PlannerProgramExercise.setsToDisplaySets(sets, hasCurrentSets, globals);
              return (
                <div>
                  <div>
                    {plannerExercise.setVariations.length > 1 && (
                      <GroupHeader highlighted={true} name={`Set Variation ${i + 1}`} />
                    )}
                  </div>
                  <div className="flex items-end">
                    <div>
                      <div className="text-xs text-center text-grayv2-main">Warmups</div>
                      <div>
                        <div className="flex">
                          {displayWarmupSets.map((g) => (
                            <HistoryRecordSet sets={g} isNext={true} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 mr-4 bg-grayv2-100" style={{ width: "1px", height: "60px" }} />
                    <div>
                      {reusingSets && <div className="text-xs text-grayv2-main">Reusing {reusingSets}</div>}
                      <div className="flex flex-wrap">
                        {displayGroups.map((g) => (
                          <HistoryRecordSet sets={g} isNext={true} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-1 pb-2 text-xs text-grayv2-main">
            {progress && (
              <div>
                <span className="font-bold">Progress: </span>
                {progress.fnName === "none" ? (
                  "none"
                ) : (
                  <>
                    {progress.fnName}({progress.fnArgs.join(", ")}){progress.body && ` { ...${progress.body} }`}
                    {progress.script && ` { ... }`}
                  </>
                )}
              </div>
            )}
            {update && (
              <div>
                <span className="font-bold">Update: </span>
                {update.fnName}({update.fnArgs.join(", ")}){update.body && ` { ...${update.body} }`}
                {update.script && ` { ... }`}
              </div>
            )}
            {plannerExercise.tags.length > 0 && (
              <div>
                <span className="font-bold">Tags: </span>
                {plannerExercise.tags.join(", ")}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
