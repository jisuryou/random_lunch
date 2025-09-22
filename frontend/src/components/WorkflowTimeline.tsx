import type { WorkflowStep } from '../types';

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
}

function statusToLabel(status: WorkflowStep['status']): string {
  switch (status) {
    case 'active':
      return '진행 중';
    case 'done':
      return '완료';
    case 'error':
      return '오류';
    default:
      return '대기';
  }
}

export function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  return (
    <ol className="workflow" aria-label="추천 작업 흐름">
      {steps.map((step, index) => (
        <li key={step.id} className={`workflow-item status-${step.status}`}>
          <div className="workflow-index" aria-hidden>
            {index + 1}
          </div>
          <div className="workflow-body">
            <div className="workflow-header">
              <span className="workflow-label">{step.label}</span>
              <span className="workflow-status" data-status={step.status}>
                {statusToLabel(step.status)}
              </span>
            </div>
            {step.message && <p className="workflow-message">{step.message}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
