import { describe, it, expect } from 'vitest';
import { DAGPlanner } from '../src/lib/engine/dagPlanner';
import { NodeExecutors } from '../src/lib/engine/executors';
import { PipelineEngine } from '../src/lib/engine/pipelineEngine';
import { PipelineNode, PipelineEdge, Pipeline } from '../src/types/pipeline';

describe('Pipeline Engine & DAG Planner Tests', () => {
  it('should topological sort a valid DAG without cycles', () => {
    const nodes: PipelineNode[] = [
      { id: 'node-1', type: 'Source', label: 'Source', position: { x: 0, y: 0 }, config: {}, inputs: [], outputs: [] },
      { id: 'node-2', type: 'Filter', label: 'Filter', position: { x: 0, y: 0 }, config: {}, inputs: [], outputs: [] },
      { id: 'node-3', type: 'Output', label: 'Output', position: { x: 0, y: 0 }, config: {}, inputs: [], outputs: [] },
    ];
    const edges: PipelineEdge[] = [
      { id: 'e-1', sourceNodeId: 'node-1', targetNodeId: 'node-2' },
      { id: 'e-2', sourceNodeId: 'node-2', targetNodeId: 'node-3' },
    ];

    const plan = DAGPlanner.planExecution(nodes, edges);
    expect(plan.isValid).toBe(true);
    expect(plan.executionOrder.map((n) => n.id)).toEqual(['node-1', 'node-2', 'node-3']);
  });

  it('should detect cycles in visual DAG graphs', () => {
    const nodes: PipelineNode[] = [
      { id: 'node-1', type: 'Source', label: 'Source', position: { x: 0, y: 0 }, config: {}, inputs: [], outputs: [] },
      { id: 'node-2', type: 'Filter', label: 'Filter', position: { x: 0, y: 0 }, config: {}, inputs: [], outputs: [] },
    ];
    const edges: PipelineEdge[] = [
      { id: 'e-1', sourceNodeId: 'node-1', targetNodeId: 'node-2' },
      { id: 'e-2', sourceNodeId: 'node-2', targetNodeId: 'node-1' }, // Cycle!
    ];

    const plan = DAGPlanner.planExecution(nodes, edges);
    expect(plan.isValid).toBe(false);
    expect(plan.errors[0]).toContain('Cycle detected');
  });

  it('should execute node executors for filter and map', () => {
    const filterNode: PipelineNode = {
      id: 'f-1',
      type: 'Filter',
      label: 'Filter Node',
      position: { x: 0, y: 0 },
      config: { filterField: 'score', filterOperator: '>', filterValue: 100 },
      inputs: [],
      outputs: [],
    };

    const inputData = [
      { id: 1, score: 50 },
      { id: 2, score: 150 },
      { id: 3, score: 200 },
    ];

    const result = NodeExecutors.executeNode(filterNode, inputData);
    expect(result.recordsOut.length).toBe(2);
    expect(result.recordsDropped).toBe(1);
  });
});
