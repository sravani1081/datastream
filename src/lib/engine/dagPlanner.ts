// DAG Dependency Graph, Cycle Detector & Topological Execution Planner

import { PipelineNode, PipelineEdge } from '../../types/pipeline';

export interface ExecutionPlan {
  executionOrder: PipelineNode[];
  levels: PipelineNode[][];
  isValid: boolean;
  errors: string[];
}

export class DAGPlanner {
  /**
   * Build execution graph, detect cycles, and produce topological execution order
   */
  static planExecution(nodes: PipelineNode[], edges: PipelineEdge[]): ExecutionPlan {
    const errors: string[] = [];

    if (nodes.length === 0) {
      return { executionOrder: [], levels: [], isValid: false, errors: ['Pipeline graph contains no nodes.'] };
    }

    const nodeMap = new Map<string, PipelineNode>();
    nodes.forEach((n) => nodeMap.set(n.id, n));

    const adjacencyList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach((n) => {
      adjacencyList.set(n.id, []);
      inDegree.set(n.id, 0);
    });

    edges.forEach((e) => {
      if (!nodeMap.has(e.sourceNodeId)) {
        errors.push(`Edge ${e.id} references missing source node ${e.sourceNodeId}`);
        return;
      }
      if (!nodeMap.has(e.targetNodeId)) {
        errors.push(`Edge ${e.id} references missing target node ${e.targetNodeId}`);
        return;
      }

      adjacencyList.get(e.sourceNodeId)!.push(e.targetNodeId);
      inDegree.set(e.targetNodeId, (inDegree.get(e.targetNodeId) || 0) + 1);
    });

    // Verify source nodes exist
    const hasSourceNode = nodes.some((n) => n.type === 'Source' || n.type === 'Stream' || n.type === 'Batch Input');
    if (!hasSourceNode) {
      errors.push('Pipeline must contain at least one input source node (Source, Stream, or Batch Input).');
    }

    // Kahn's Algorithm for Topological Sort
    const queue: string[] = [];
    nodes.forEach((n) => {
      if ((inDegree.get(n.id) || 0) === 0) {
        queue.push(n.id);
      }
    });

    const executionOrder: PipelineNode[] = [];
    const nodeLevelsMap = new Map<string, number>();
    queue.forEach((id) => nodeLevelsMap.set(id, 0));

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentNode = nodeMap.get(currentId)!;
      executionOrder.push(currentNode);

      const currentLevel = nodeLevelsMap.get(currentId) || 0;
      const neighbors = adjacencyList.get(currentId) || [];

      for (const neighborId of neighbors) {
        const newDegree = (inDegree.get(neighborId) || 0) - 1;
        inDegree.set(neighborId, newDegree);

        const neighborLevel = Math.max(nodeLevelsMap.get(neighborId) || 0, currentLevel + 1);
        nodeLevelsMap.set(neighborId, neighborLevel);

        if (newDegree === 0) {
          queue.push(neighborId);
        }
      }
    }

    if (executionOrder.length !== nodes.length) {
      errors.push('Cycle detected in pipeline graph! Visual DAG must be acyclic.');
      return { executionOrder: [], levels: [], isValid: false, errors };
    }

    // Group nodes by execution level for parallel step visualization
    const levelGroups: Map<number, PipelineNode[]> = new Map();
    executionOrder.forEach((node) => {
      const lvl = nodeLevelsMap.get(node.id) || 0;
      if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
      levelGroups.get(lvl)!.push(node);
    });

    const levels: PipelineNode[][] = Array.from(levelGroups.keys())
      .sort((a, b) => a - b)
      .map((lvl) => levelGroups.get(lvl)!);

    return {
      executionOrder,
      levels,
      isValid: errors.length === 0,
      errors,
    };
  }
}
