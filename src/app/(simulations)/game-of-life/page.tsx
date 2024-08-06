'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const speeds = [250, 100, 50, 25, 10, 1];
const sizes = [2, 3, 5, 10];

const buttonClass: string & React.CSSProperties =
  'rounded bg-blue-500 px-3 py-1 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-500';

const initialRules = ['-1', '-1', '0', '1', '-1', '-1', '-1', '-1', '-1'];
const presets: { [key: string]: { height: number; width: number; fields: (0 | 1)[] } } = {
  glider: {
    height: 3,
    width: 3,
    fields: [0, 1, 0, 0, 0, 1, 1, 1, 1]
  },
  glider_gun: {
    height: 9,
    width: 36,
    fields: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
  },
  '101': {
    height: 12,
    width: 18,
    fields: [
      0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1,
      0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1,
      0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0,
      0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0
    ]
  }
};
type BasicPresets = 'blank' | 'random_10' | 'random_20' | 'random_50';

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [rules, setRules] = useState<string[]>(initialRules);
  const [preset, setPreset] = useState<(keyof typeof presets | BasicPresets) & string>('random_20');

  const [numRows, setNumRows] = useState(0);
  const [numCols, setNumCols] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [grid, setGrid] = useState<number[][]>([]);

  const [speed, setSpeed] = useState(50);
  const [size, setSize] = useState(4);

  const createGrid = useCallback(() => {
    const grid: number[][] = [];
    if (preset === 'blank') {
      for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
          grid[i][j] = 0;
        }
      }
    } else if (preset.startsWith('random')) {
      for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
          grid[i][j] = Math.random() < parseInt(preset.split('_')[1]) * 0.01 ? 1 : 0;
        }
      }
    } else if (Object.keys(presets).includes(preset)) {
      const { height, width, fields } = presets[preset as keyof typeof presets];
      for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
          grid[i][j] = 0;
        }
      }
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          grid[i + Math.floor((numRows - presets[preset].height) / 2)][
            j + Math.floor((numCols - presets[preset].width) / 2)
          ] = fields[i * width + j];
        }
      }
    } else {
      throw new Error('Invalid preset');
    }
    return grid;
  }, [numCols, numRows, preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        setCtx(context);
      }
    }
  }, []);

  useEffect(() => {
    setGrid(createGrid());
  }, [numRows, numCols, createGrid]);

  useEffect(() => {
    setNumRows(400 / size);
    setNumCols(600 / size);
  }, [size]);

  const drawGrid = useCallback(() => {
    if (!ctx || !canvasRef.current) {
      return;
    }
    setCtx((prev) => {
      prev && canvasRef.current && prev.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return prev;
    });
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (grid[i] && grid[i][j] === 1) {
          setCtx((prev) => {
            if (prev && canvasRef.current) {
              prev.fillStyle = 'black';
              prev.fillRect(j * size, i * size, size, size);
            }
            return prev;
          });
        }
      }
    }
  }, [ctx, grid, numCols, numRows, size]);

  const countNeighbors = useCallback(
    (row: number, col: number) => {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const r = row + i;
          const c = col + j;
          if (r >= 0 && r < numRows && c >= 0 && c < numCols && !(i === 0 && j === 0)) {
            count += grid[r][c];
          }
        }
      }
      return count;
    },
    [grid, numCols, numRows]
  );

  const updateGrid = useCallback(() => {
    const newGrid: number[][] = [];
    for (let i = 0; i < numRows; i++) {
      newGrid[i] = [];
      for (let j = 0; j < numCols; j++) {
        const neighbors = countNeighbors(i, j);
        if (rules[neighbors] === '1') {
          newGrid[i][j] = 1;
        } else if (rules[neighbors] === '-1') {
          newGrid[i][j] = 0;
        } else {
          newGrid[i][j] = grid[i][j];
        }
      }
    }
    setGrid(newGrid);
  }, [countNeighbors, grid, numCols, numRows, rules]);

  useEffect(() => {
    const interval = setInterval(() => {
      isRunning && updateGrid();
    }, speed);
    drawGrid();
    return () => clearInterval(interval);
  }, [drawGrid, isRunning, speed, updateGrid]);

  const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];

  return (
    <div className='mx-auto max-w-[700px]'>
      <canvas
        width={600}
        height={400}
        ref={canvasRef}
        className='mx-auto my-6 h-full w-full rounded-lg border p-1 shadow'
      />
      <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-4'>
        <button
          hidden={isRunning}
          className={buttonClass}
          onClick={() => {
            updateGrid();
            setIsRunning(true);
          }}
        >
          Start
        </button>
        <button
          hidden={!isRunning}
          className={buttonClass}
          onClick={() => {
            setIsRunning(false);
          }}
        >
          Pause
        </button>
        <button
          className={buttonClass}
          onClick={() => {
            setIsRunning(false);
            setGrid(createGrid());
            drawGrid();
          }}
        >
          Reset
        </button>
        <button
          hidden={isRunning}
          className={buttonClass}
          onClick={() => {
            updateGrid();
            drawGrid();
          }}
        >
          Next Step
        </button>
        <button
          hidden={!isRunning}
          className={buttonClass}
          onClick={() => {
            setSpeed((prev) => speeds[(speeds.indexOf(prev) + 1) % speeds.length]);
          }}
        >
          Interval:{' '}
          {speed === 1 ? (
            <span className='align-middle text-3xl font-bold leading-3 text-red-500'>&#8734;</span>
          ) : (
            speed
          )}{' '}
          -{'>'}{' '}
          {nextSpeed === 1 ? (
            <span className='align-middle text-3xl font-bold leading-3 text-red-500'>&#8734;</span>
          ) : (
            nextSpeed
          )}
        </button>
        <button
          className={buttonClass}
          onClick={() => {
            setSize((prev) => sizes[(sizes.indexOf(prev) + 1) % sizes.length]);
            setGrid(createGrid());
            updateGrid();
            drawGrid();
          }}
        >
          Size: {size} -{'>'} {sizes[(sizes.indexOf(size) + 1) % sizes.length]}
        </button>
      </div>

      <div className='mt-7'>
        <div className='flex justify-between'>
          <span className='font-bold'>Customization:</span>
          <button onClick={() => setRules(initialRules)} className='text-blue-500 underline'>
            Reset Rules
          </button>
        </div>
        <div className='mt-2 grid font-mono sm:grid-cols-3'>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
            <span key={count} className='w-full text-center'>
              <span className={count === 1 ? 'mr-6' : 'mr-4'}>
                {count} Neighbor{count !== 1 && 's'}
              </span>
              <Select
                value={rules[count]}
                onValueChange={(value: string) =>
                  setRules((prev) => {
                    const newRules = [...prev];
                    newRules[count] = value;
                    return newRules;
                  })
                }
              >
                <SelectTrigger className='mx-auto h-7 w-[150px]'>
                  <SelectValue placeholder='Action' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'1'}>Populate</SelectItem>
                  <SelectItem value={'-1'}>Die</SelectItem>
                  <SelectItem value={'0'}>Don&apos;t Change</SelectItem>
                </SelectContent>
              </Select>
            </span>
          ))}
        </div>
      </div>
      <div className='mt-7'>
        <span className='font-bold'>Presets:</span>
        <Select
          value={preset}
          onValueChange={(value: string) => setPreset(value as keyof typeof presets | BasicPresets)}
        >
          <SelectTrigger className='mx-auto h-7 w-[150px]'>
            <SelectValue placeholder='Preset' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'blank'}>Blank</SelectItem>
            <SelectItem value={'random_10'}>Random 10%</SelectItem>
            <SelectItem value={'random_20'}>Random 20%</SelectItem>
            <SelectItem value={'random_50'}>Random 50%</SelectItem>
            <SelectItem value={'glider'}>Glider</SelectItem>
            <SelectItem value={'glider_gun'}>Glider Gun</SelectItem>
            <SelectItem value={'101'}>1 0 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Page;
