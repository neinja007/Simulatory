'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const speeds = [250, 100, 50, 25, 10, 1];
const sizes = [2, 4, 6, 8];

const buttonClass: string & React.CSSProperties =
  'rounded bg-blue-500 px-3 py-1 font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-500';

type Preset = ('blank' | 'random_10' | 'random_20' | 'random_50' | keyof typeof presets | keyof typeof groups) & string;

const initialRules = ['-1', '-1', '0', '1', '-1', '-1', '-1', '-1', '-1'];
const presets: {
  [key: string]: {
    height: number;
    width: number;
    fields: (number | `${'0' | '1'}-${number}`)[][];
    align?: `${'t' | 'b' | 'm'}${'r' | 'l' | 'm'}`;
  };
} = {
  glider: {
    height: 3,
    width: 3,
    fields: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ],
    align: 'tl'
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
const groups: {
  [key: string]: {
    size?: number;
    repeat?: boolean;
    data: {
      presetName: keyof typeof presets;
      align: `${'t' | 'b' | 'm'}${'r' | 'l' | 'm'}`;
      invert?: 'h' | 'v' | 'b';
      offsetX?: number;
      offsetY?: number;
    }[];
  };
} = {
  glider_collider: {
    size: 2,
    data: [
      {
        presetName: 'glider_gun',
        align: 'tl',
        offsetX: 15,
        offsetY: 10
      },
      {
        presetName: 'glider_gun',
        align: 'tr',
        invert: 'h',
        offsetX: 20
      },
      {
        presetName: 'glider_gun',
        align: 'bl',
        invert: 'v',
        offsetX: 20
      },
      {
        presetName: 'glider_gun',
        align: 'br',
        invert: 'b',
        offsetX: 15,
        offsetY: 10
      }
    ]
  },
  spaceship_terminator: {
    size: 2,
    data: [
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 90
      },
      {
        presetName: 'glider',
        align: 'tl',
        offsetX: 30
      }
    ]
  },
  spaceship_race: {
    size: 2,
    data: [
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 4
      },
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 46
      },
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 88
      },
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 130
      },
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 172
      },
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 214
      },
      {
        presetName: 'spaceship_1',
        align: 'bl',
        offsetX: 256
      },
      {
        presetName: 'spaceship_1',
        align: 'tl',
        offsetX: 25,
        invert: 'v'
      },
      {
        presetName: 'spaceship_1',
        align: 'tl',
        offsetX: 67,
        invert: 'v'
      },
      {
        presetName: 'spaceship_1',
        align: 'tl',
        offsetX: 109,
        invert: 'v'
      },
      {
        presetName: 'spaceship_1',
        align: 'tl',
        offsetX: 151,
        invert: 'v'
      },
      {
        presetName: 'spaceship_1',
        align: 'tl',
        offsetX: 193,
        invert: 'v'
      },
      {
        presetName: 'spaceship_1',
        align: 'tl',
        offsetX: 235,
        invert: 'v'
      },
      {
        presetName: 'spaceship_1',
        align: 'tl',
        offsetX: 277,
        invert: 'v'
      }
    ]
  },
  glider_spam: {
    size: 2,
    data: [
      {
        presetName: 'glider_gun',
        align: 'tr'
      },
      {
        presetName: 'glider_gun',
        align: 'tr',
        offsetX: -40
      },
      {
        presetName: 'glider_gun',
        align: 'tr',
        offsetX: -80
      },
      {
        presetName: 'glider_gun',
        align: 'tr',
        offsetX: -120
      },
      {
        presetName: 'glider_gun',
        align: 'tr',
        offsetX: -160
      },
      {
        presetName: 'glider_gun',
        align: 'tr',
        offsetX: -200
      },
      {
        presetName: 'glider_gun',
        align: 'bl',
        invert: 'b'
      },
      {
        presetName: 'glider_gun',
        align: 'bl',
        invert: 'b',
        offsetX: -40
      },
      {
        presetName: 'glider_gun',
        align: 'bl',
        invert: 'b',
        offsetX: -80
      },
      {
        presetName: 'glider_gun',
        align: 'bl',
        invert: 'b',
        offsetX: -120
      },
      {
        presetName: 'glider_gun',
        align: 'bl',
        invert: 'b',
        offsetX: -160
      },
      {
        presetName: 'glider_gun',
        align: 'bl',
        invert: 'b',
        offsetX: -200
      },
      {
        presetName: 'shredder',
        align: 'mm'
      }
    ]
  }
};

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const [rules, setRules] = useState<string[]>(initialRules);
  const [preset, setPreset] = useState<Preset>('random_20');

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
      const binaryFields: (0 | 1)[] = [];

      fields.forEach((row) => {
        const newRow = [];
        row.forEach((cell) => {
          if (typeof cell === 'number') {
            newRow.push(cell);
          } else {
            const [value, count] = cell.split('-');
            for (let i = 0; i < parseInt(count); i++) {
              newRow.push(parseInt(value));
            }
          }
        });
        while (newRow.length < width) {
          newRow.push(0);
        }
        if (newRow.length > width) {
          throw new Error('Invalid preset');
        }
        binaryFields.push(...(newRow as (0 | 1)[]));
      });
      for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
          grid[i][j] = 0;
        }
      }
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const offsetLeft = presets[preset].align?.includes('l')
            ? 0
            : presets[preset].align?.includes('r')
              ? Math.floor(numCols - presets[preset].width)
              : Math.floor((numCols - presets[preset].width) / 2);

          const offsetTop = presets[preset].align?.includes('t')
            ? 0
            : presets[preset].align?.includes('b')
              ? Math.floor(numRows - presets[preset].height)
              : Math.floor((numRows - presets[preset].height) / 2);

          grid[i + offsetTop][j + offsetLeft] = binaryFields[i * width + j];
        }
      }
    } else if (Object.keys(groups).includes(preset)) {
      for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
          grid[i][j] = 0;
        }
      }
      setSize((prev) => (groups[preset].size ? groups[preset].size : prev));
      groups[preset].data.forEach(({ presetName, align, invert, offsetX = 0, offsetY = 0 }) => {
        const { height, width, fields } = presets[presetName];
        const binaryFields: (0 | 1)[] = [];

        fields.forEach((row) => {
          const newRow = [];
          row.forEach((cell) => {
            if (typeof cell === 'number') {
              newRow.push(cell);
            } else {
              const [value, count] = cell.split('-');
              for (let i = 0; i < parseInt(count); i++) {
                newRow.push(parseInt(value));
              }
            }
          });
          while (newRow.length < width) {
            newRow.push(0);
          }
          if (newRow.length > width) {
            throw new Error('Invalid preset');
          }
          binaryFields.push(...(newRow as (0 | 1)[]));
        });
        for (let i = 0; i < height; i++) {
          for (let j = 0; j < width; j++) {
            const offsetLeft = align.includes('l')
              ? 0
              : align.includes('r')
                ? Math.floor(numCols - width)
                : Math.floor((numCols - width) / 2);

            const offsetTop = align.includes('t')
              ? 0
              : align.includes('b')
                ? Math.floor(numRows - height)
                : Math.floor((numRows - height) / 2);

            const row = i + offsetTop;
            const col = j + offsetLeft;

            if (invert === 'h') {
              grid[row + offsetY][col - offsetX] = binaryFields[(i + 1) * width - j - 1];
            } else if (invert === 'v') {
              grid[row - offsetY][col + offsetX] = binaryFields[width * height - ((i + 1) * width - j - 1) - 1];
            } else if (invert === 'b') {
              grid[row - offsetY][col - offsetX] = binaryFields[width * height - (i * width + j) - 1];
            } else {
              grid[row + offsetY][col + offsetX] = binaryFields[i * width + j];
            }
          }
        }
      });
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
    <div className='mx-auto max-w-[800px]'>
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
          disabled={!!(groups[preset] && groups[preset].size)}
          className={buttonClass}
          onClick={() => {
            setSize((prev) => sizes[(sizes.indexOf(prev) + 1) % sizes.length]);
            setGrid(createGrid());
            updateGrid();
            drawGrid();
          }}
        >
          Size: {size}{' '}
          {!(groups[preset] && groups[preset].size) ? (
            <span>
              -{'>'} {sizes[(sizes.indexOf(size) + 1) % sizes.length]}
            </span>
          ) : (
            <span>(fixed)</span>
          )}
        </button>
      </div>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Rules</AccordionTrigger>
          <AccordionContent>
            <div className='flex justify-end'>
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
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>Presets</AccordionTrigger>
          <AccordionContent>
            <Select value={preset} onValueChange={(value: string) => setPreset(value as Preset)}>
              <SelectTrigger className='mx-auto h-7 w-[150px]'>
                <SelectValue placeholder='Preset' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'blank'}>Blank</SelectItem>
                <SelectItem value={'random_10'}>Random 10%</SelectItem>
                <SelectItem value={'random_20'}>Random 20%</SelectItem>
                <SelectItem value={'random_50'}>Random 50%</SelectItem>
                <SelectSeparator />
                {Object.keys(presets).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key
                      .split('_')
                      .map((word) => word[0].toUpperCase() + word.slice(1))
                      .join(' ')}
                  </SelectItem>
                ))}
                <SelectSeparator />
                {Object.keys(groups).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key
                      .split('_')
                      .map((word) => word[0].toUpperCase() + word.slice(1))
                      .join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Page;
