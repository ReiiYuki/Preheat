import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface CommandItem {
  title: string;
  icon: string;
  command: ({ editor, range }: { editor: any; range: any }) => void;
}

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useEffect(() => {
    const el = document.querySelector('.command-item.is-selected');
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-[--color-bg] border border-[--color-border] rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.1)] p-1 flex flex-col min-w-[200px] max-h-[400px] overflow-y-auto">
      {props.items.length ? (
        props.items.map((item: CommandItem, index: number) => (
          <button
            className={`command-item flex items-center gap-3 w-full px-3 py-2 border-none bg-transparent text-left rounded cursor-pointer text-[--color-text] font-inherit text-sm hover:bg-[--color-hover] ${index === selectedIndex ? 'is-selected bg-[--color-hover]' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="w-6 h-6 flex items-center justify-center bg-[--color-surface] rounded border border-[--color-border] font-medium text-xs">{item.icon}</div>
            <span className="font-medium">{item.title}</span>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-[--color-text-secondary]">No result</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';
