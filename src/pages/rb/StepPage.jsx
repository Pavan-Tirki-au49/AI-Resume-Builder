import React from 'react';
import PremiumLayout from '../../components/Layout/PremiumLayout';
import { STEPS } from '../../lib/steps';

const StepPage = ({ stepId }) => {
    const step = STEPS.find(s => s.id === stepId);
    if (!step) return <div>Step not found</div>;

    return (
        <PremiumLayout
            stepId={step.id}
            promptText={step.prompt}
        >
            <div className="prose prose-invert max-w-none">
                <h3>Objective</h3>
                <p>Complete the {step.name} phase of the project.</p>

                <h3>Instructions</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Review the requirements for this step.</li>
                    <li>Copy the prompt from the build panel on the right.</li>
                    <li>If using Lovable, paste the prompt to generate the code.</li>
                    <li>Verify the output meets the acceptance criteria.</li>
                    <li>Take a screenshot of the result and upload it in the build panel to unlock the next step.</li>
                </ul>

                <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg mt-6 border border-[var(--border-color)]">
                    <h4 className="text-lg font-bold mb-2">Key Deliverables</h4>
                    <p>An artifact proving the completion of the {step.name} step.</p>
                </div>
            </div>
        </PremiumLayout>
    );
};

export default StepPage;
