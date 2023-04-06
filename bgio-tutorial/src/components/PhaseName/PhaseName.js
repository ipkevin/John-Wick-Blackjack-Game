import "./PhaseName.scss";

// If u cannot get state or onanimationEnd working here (latter will work with useRefs), then hack way is to
// simply create 2 classes that do the same thing and flip between them for every phase. The change of class will trigger
// NO, redraw the whole output
export default function PhaseName({phaseTitle,phase}) {

    // MUST redraw the whole element (<h2>) for each case as that will cause animation to run again
    // If you try instead to replace just the class (eg, with state) it will not trigger animation to run again (even if it's a diff class)
    // Alt might work with onAnimationEnd, but need to use useRefs in that case.

    return (
        <>
        {(phase === "betting") ?
            <h2 className={`phase-name`}>
            {phaseTitle}
            </h2>
            : ""
        }
        {(phase === "playing") ?
            <h2 className={`phase-name`}>
            {phaseTitle}
            </h2>
            : ""
        }
        {(phase === "finishing") ?
            <h2 className={`phase-name`}>
            {phaseTitle}
            </h2>
            : ""
        }
        </>
    )
}