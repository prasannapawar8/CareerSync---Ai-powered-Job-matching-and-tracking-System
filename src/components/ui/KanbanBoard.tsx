'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { JobStatus } from '@/app/generated/prisma/enums';

export type SavedJobData = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  status: JobStatus;
  applyUrl: string;
};

const COLUMNS = [
  { id: JobStatus.SAVED, title: 'Saved' },
  { id: JobStatus.APPLIED, title: 'Applied' },
  { id: JobStatus.INTERVIEWING, title: 'Interviewing' },
  { id: JobStatus.OFFERED, title: 'Offered' },
  { id: JobStatus.REJECTED, title: 'Rejected' },
];

import CoverLetterModal from './CoverLetterModal';

function JobCard({ job, onClick }: { job: SavedJobData; onClick?: () => void }) {
  return (
    <div 
      className="bg-surface border border-border rounded-lg p-4 shadow-sm group relative cursor-pointer hover:border-accent transition-colors"
      onClick={onClick}
    >
      <h3 className="font-medium text-foreground text-sm line-clamp-2">{job.title}</h3>
      <p className="text-xs text-muted mt-1">{job.company}</p>
      {job.location && <p className="text-xs text-subtle mt-1">{job.location}</p>}
      <a
        href={job.applyUrl}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-xs text-foreground font-medium underline underline-offset-4 hover:text-muted mt-3 inline-block relative z-10"
      >
        View Application ↗
      </a>
    </div>
  );
}

function SortableJobCard({ job, onClick }: { job: SavedJobData; onClick?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id, data: { type: 'Job', job } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
      <JobCard job={job} onClick={onClick} />
    </div>
  );
}

function Column({
  columnId,
  title,
  jobs,
  onJobClick,
}: {
  columnId: JobStatus;
  title: string;
  jobs: SavedJobData[];
  onJobClick: (job: SavedJobData) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: {
      type: 'Column',
      columnId,
    },
  });

  return (
    <div className="flex flex-col bg-surface-muted rounded-xl border border-border w-72 shrink-0 h-full max-h-[700px]">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-sm">{title}</h2>
        <span className="bg-surface border border-border text-muted text-xs px-2 py-0.5 rounded-full font-medium">
          {jobs.length}
        </span>
      </div>
      <div className="p-3 flex-1 overflow-y-auto" ref={setNodeRef}>
        <SortableContext
          id={columnId}
          items={jobs.map((j) => j.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3 min-h-[150px]">
            {jobs.map((job) => (
              <SortableJobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard({
  initialJobs,
}: {
  initialJobs: SavedJobData[];
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [jobs, setJobs] = useState<SavedJobData[]>(initialJobs);
  const [activeJob, setActiveJob] = useState<SavedJobData | null>(null);
  const [selectedJob, setSelectedJob] = useState<SavedJobData | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!isMounted) {
    return <div className="h-full flex gap-6 overflow-x-auto pb-4"><div className="w-72 h-[600px] bg-surface-muted rounded-xl border border-border shrink-0"></div></div>;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = jobs.find((j) => j.id === active.id);
    if (job) setActiveJob(job);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAJob = active.data.current?.type === 'Job';
    const isOverAJob = over.data.current?.type === 'Job';

    if (!isActiveAJob) return;

    // Dropping a job over another job
    if (isActiveAJob && isOverAJob) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((t) => t.id === activeId);
        const overIndex = jobs.findIndex((t) => t.id === overId);
        
        if (jobs[activeIndex].status !== jobs[overIndex].status) {
          // Changed column
          const newJobs = [...jobs];
          newJobs[activeIndex] = { ...newJobs[activeIndex], status: jobs[overIndex].status };
          return arrayMove(newJobs, activeIndex, overIndex);
        }
        
        return arrayMove(jobs, activeIndex, overIndex);
      });
    }

    // Dropping a job over an empty column
    const isOverAColumn = over.data.current?.type === 'Column' || COLUMNS.some(c => c.id === overId);
    if (isActiveAJob && isOverAColumn) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((t) => t.id === activeId);
        const newJobs = [...jobs];
        newJobs[activeIndex] = { ...newJobs[activeIndex], status: overId as JobStatus };
        return arrayMove(newJobs, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveJob(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeJob = jobs.find((j) => j.id === activeId);
    if (!activeJob) return;

    // Persist change to database
    try {
      await fetch(`/api/jobs/${activeJob.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: activeJob.status }),
      });
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {selectedJob && (
        <CoverLetterModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 h-full overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              title={col.title}
              jobs={jobs.filter((j) => j.status === col.id)}
              onJobClick={setSelectedJob}
            />
          ))}

          <DragOverlay>
            {activeJob ? <JobCard job={activeJob} /> : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
}
