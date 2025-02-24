import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Todo, PRIORITY_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import TextareaAutosize from 'react-textarea-autosize';
import {
  Trash2,
  GripVertical,
  MessageSquare,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  isSelected,
  onSelect,
}: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex flex-col gap-2 p-4 rounded-lg transition-all bg-card border border-border/50',
        'hover:border-border',
        'animate-fadeIn',
        isDragging && 'opacity-50',
        todo.completed && 'opacity-60'
      )}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="touch-none p-1 opacity-0 group-hover:opacity-50 hover:opacity-100"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="h-5 w-5 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted rounded-md"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            <TextareaAutosize
              value={todo.text}
              onChange={(e) => onUpdate(todo.id, { text: e.target.value })}
              className={cn(
                'w-full bg-transparent resize-none focus:outline-none',
                'text-foreground',
                todo.completed && 'line-through text-muted-foreground'
              )}
              rows={1}
            />

            <span className="text-sm px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize whitespace-nowrap">
              {todo.category}
            </span>

            <span className="text-sm whitespace-nowrap">
              {PRIORITY_CONFIG[todo.priority].icon}
            </span>

            {todo.comments.length > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">{todo.comments.length}</span>
              </div>
            )}
          </div>

          {todo.dueDate && (
            <p className="text-xs text-muted-foreground mt-1 ml-7">
              Due {format(todo.dueDate, 'PPP')}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <div className="ml-12 space-y-4 animate-slideDown">
          <TextareaAutosize
            value={todo.description}
            onChange={(e) => onUpdate(todo.id, { description: e.target.value })}
            placeholder="Add description..."
            className="w-full bg-muted p-3 rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          />

          <div className="space-y-2">
            {todo.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => {
                    onUpdate(todo.id, {
                      subtasks: todo.subtasks.map((st) =>
                        st.id === subtask.id
                          ? { ...st, completed: !st.completed }
                          : st
                      ),
                    });
                  }}
                  className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <input
                  value={subtask.text}
                  onChange={(e) => {
                    onUpdate(todo.id, {
                      subtasks: todo.subtasks.map((st) =>
                        st.id === subtask.id
                          ? { ...st, text: e.target.value }
                          : st
                      ),
                    });
                  }}
                  className="flex-1 bg-transparent text-foreground focus:outline-none text-sm"
                  placeholder="Add subtask..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onUpdate(todo.id, {
                      subtasks: todo.subtasks.filter((st) => st.id !== subtask.id),
                    });
                  }}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onUpdate(todo.id, {
                  subtasks: [
                    ...todo.subtasks,
                    {
                      id: crypto.randomUUID(),
                      text: '',
                      completed: false,
                    },
                  ],
                });
              }}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              + Add subtask
            </Button>
          </div>

          <div className="space-y-2">
            {todo.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 group/comment">
                <div className="flex-1 bg-muted p-3 rounded-lg">
                  <p className="text-sm text-foreground">{comment.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(comment.createdAt, 'PPp')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onUpdate(todo.id, {
                      comments: todo.comments.filter((c) => c.id !== comment.id),
                });
                  }}
                  className="opacity-0 group-hover/comment:opacity-100 h-6 w-6 hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem('comment') as HTMLInputElement;
                if (input.value.trim()) {
                  onUpdate(todo.id, {
                    comments: [
                      ...todo.comments,
                      {
                        id: crypto.randomUUID(),
                        text: input.value.trim(),
                        createdAt: new Date(),
                      },
                    ],
                  });
                  form.reset();
                }
              }}
              className="flex gap-2"
            >
              <input
                name="comment"
                placeholder="Add comment..."
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              />
              <Button type="submit" variant="ghost" size="sm">
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}