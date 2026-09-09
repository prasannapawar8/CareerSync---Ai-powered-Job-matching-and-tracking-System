'use client';

import { useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, GripVertical, MapPin } from 'lucide-react';
import { JobStatus } from '@/app/generated/prisma/enums';
import { cn } from '@/src/lib/utils';
import { useIsHydrated } from '@/src/lib/theme';
import CoverLetterModal from './CoverLetterModal';

export type SavedJobData = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  status: JobStatus;
  applyUrl: string;
  matchScore?: number | null;
};

const COLUMNS: { id: JobStatus; title: string; accent: string; chip: string }[] = [
  { id: JobStatus.SAVED, title: 'Saved', accent: 'bg-subtle', chip: 'text-muted' },
  { id: JobStatus.APPLIED, title: 'Applied', accent: 'bg-info', chip: 'text-info' },
  { id: JobStatus.INTERVIEWING, title: 'Interviewing', accent: 'bg-warning', chip: 'text-warning' },
  { id: JobStatus.OFFERED, title: 'Offered', accent: 'bg-success', chip: 'text-success' },
  { id: JobStatus.REJECTED, title: 'Rejected', accent: 'bg-danger', chip: 'text-danger' },
];

function scoreTone(score: number) {
  if (score >= 75) return 'bg-success-surface text-success';
  if (score >= 50) return 'bg-primary-soft text-primary';
  return 'bg-warning-surface text-warning';
}

function JobCard({
  job,
  onOpen,
  dragging = false,
  handleProps,
}: {
  job: SavedJobData;
  onOpen?: () => void;
  dragging?: boolean;
  handleProps?: React.HTMLAttributes<HTMLSpanElement>;
}) {
  return (
    <div
      className={cn(
        'group relative rounded-card border border-border bg-surface p-4 elevation-xs',
        'transition-[border-color,box-shadow] duration-150',
        dragging ? 'rotate-2 elevation-lg' : 'hover:border-primary/40 hover:elevation-md',
      )}
    >
      <div className="flex items-start gap-2">
        <span
          {...handleProps}
          className={cn(
            'mt-0.5 -ml-1 shrink-0 rounded text-subtle transition-opacity',
            handleProps ? 'cursor-grab opacity-0 group-hover:opacity-100 active:cursor-grabbing' : 'opacity-0',
          )}
          aria-hidden="true"
        >
          <GripVertical className="size-4" />
        </span>

        <button
          type="button"
          onClick={onOpen}
          disabled={!onOpen}
          className="min-w-0 flex-1 text-left"
        >
          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">{job.title}</h3>
          <p className="mt-1.5 text-xs font-medium text-muted">{job.company}</p>
        </button>

        {typeof job.matchScore === 'number' && (
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums',
              scoreTone(job.matchScore),
            )}
            title={`${Math.round(job.matchScore)}% match with your resume`}
          >
            {Math.round(job.matchScore)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {job.location ? (
          <span className="inline-flex min-w-0 items-center gap-1 text-xs text-subtle">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
        ) : (
          <span />
        )}
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity hover:underline group-hover:opacity-100 focus-visible:opacity-100"
        >
          Open <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}

function SortableJobCard({ job, onOpen }: { job: SavedJobData; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { type: 'Job', job },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="touch-none"
      {...attributes}
      {...listeners}
    >
      <JobCard job={job} onOpen={onOpen} handleProps={{}} />
    </div>
  );
}

function Column({
  column,
  jobs,
  onJobOpen,
}: {
  column: (typeof COLUMNS)[number];
  jobs: SavedJobData[];
  onJobOpen: (job: SavedJobData) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: 'Column', columnId: column.id } });

  return (
    <section
      className={cn(
        'flex h-full w-[17.5rem] shrink-0 flex-col rounded-panel border bg-surface-muted/50 transition-colors',
        isOver ? 'border-primary/50 bg-primary-soft/40' : 'border-border',
      )}
    >
      <header className="flex items-center gap-2 px-4 py-3">
        <span className={cn('size-1.5 rounded-full', column.accent)} />
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{column.title}</h2>
        <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-xs font-medium tabular-nums text-muted">
          {jobs.length}
        </span>
      </header>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto px-3 pb-3">
        <SortableContext id={column.id} items={jobs.map((job) => job.id)} strategy={verticalListSortingStrategy}>
          <div className="flex min-h-32 flex-col gap-2.5">
            {jobs.length === 0 ? (
              <p className="grid flex-1 place-items-center rounded-card border border-dashed border-border-strong px-3 py-8 text-center text-xs leading-5 text-subtle">
                Drop a role here
              </p>
            ) : (
              jobs.map((job) => <SortableJobCard key={job.id} job={job} onOpen={() => onJobOpen(job)} />)
            )}
          </div>
        </SortableContext>
      </div>
    </section>
  );
}

function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {COLUMNS.map((column) => (
        <div key={column.id} className="h-[26rem] w-[17.5rem] shrink-0 rounded-panel skeleton" />
      ))}
    </div>
  );
}

export default function KanbanBoard({ initialJobs }: { initialJobs: SavedJobData[] }) {
  const isHydrated = useIsHydrated();
  const [jobs, setJobs] = useState<SavedJobData[]>(initialJobs);
  const [activeJob, setActiveJob] = useState<SavedJobData | null>(null);
  const [selectedJob, setSelectedJob] = useState<SavedJobData | null>(null);
  /** Status the dragged card had when the drag began, to detect a real move. */
  const dragOriginStatus = useRef<JobStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // dnd-kit needs a live DOM; render a placeholder until hydration completes.
  if (!isHydrated) return <BoardSkeleton />;

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find((item) => item.id === event.active.id) ?? null;
    dragOriginStatus.current = job?.status ?? null;
    setActiveJob(job);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    if (active.data.current?.type !== 'Job') return;

    const overIsJob = over.data.current?.type === 'Job';
    const overIsColumn = over.data.current?.type === 'Column' || COLUMNS.some((column) => column.id === over.id);

    setJobs((current) => {
      const activeIndex = current.findIndex((job) => job.id === active.id);
      if (activeIndex === -1) return current;

      if (overIsJob) {
        const overIndex = current.findIndex((job) => job.id === over.id);
        if (overIndex === -1) return current;

        if (current[activeIndex].status !== current[overIndex].status) {
          const next = [...current];
          next[activeIndex] = { ...next[activeIndex], status: current[overIndex].status };
          return arrayMove(next, activeIndex, overIndex);
        }
        return arrayMove(current, activeIndex, overIndex);
      }

      if (overIsColumn && current[activeIndex].status !== (over.id as JobStatus)) {
        const next = [...current];
        next[activeIndex] = { ...next[activeIndex], status: over.id as JobStatus };
        return next;
      }

      return current;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const draggedId = event.active.id;
    const originStatus = dragOriginStatus.current;
    dragOriginStatus.current = null;
    setActiveJob(null);

    // Reordering within a column needs no write; only a status change does.
    const moved = jobs.find((job) => job.id === draggedId);
    if (!moved || moved.status === originStatus) return;

    try {
      await fetch(`/api/jobs/${moved.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: moved.status }),
      });
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  return (
    <>
      {selectedJob && <CoverLetterModal job={selectedJob} onClose={() => setSelectedJob(null)} />}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[34rem] gap-4 overflow-x-auto pb-3">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              jobs={jobs.filter((job) => job.status === column.id)}
              onJobOpen={setSelectedJob}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeJob ? (
            <div className="w-[17.5rem] cursor-grabbing">
              <JobCard job={activeJob} dragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
