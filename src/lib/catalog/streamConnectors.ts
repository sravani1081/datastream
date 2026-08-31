// Comprehensive Stream Connectors Catalog & Protocols Registry

export interface StreamConnectorSpec {
  id: string;
  name: string;
  category: 'PubSub' | 'MessageQueue' | 'LogStream' | 'CDC' | 'IoT' | 'DatabaseStream' | 'StorageStream';
  protocol: string;
  defaultPort: number;
  description: string;
  capabilities: {
    supportsPartitioning: boolean;
    supportsOffsetTracking: boolean;
    supportsReplay: boolean;
    supportsExactOnce: boolean;
    supportsSchemaRegistry: boolean;
    maxThroughputMsgSec: number;
  };
  sampleConfig: Record<string, string | number | boolean>;
}

export const STREAM_CONNECTORS_CATALOG: StreamConnectorSpec[] = [
  {
    id: 'conn-apache-kafka',
    name: 'Apache Kafka Engine Connector',
    category: 'PubSub',
    protocol: 'kafka://',
    defaultPort: 9092,
    description: 'Distributed pub/sub event streaming platform with partition offset management.',
    capabilities: {
      supportsPartitioning: true,
      supportsOffsetTracking: true,
      supportsReplay: true,
      supportsExactOnce: true,
      supportsSchemaRegistry: true,
      maxThroughputMsgSec: 50000,
    },
    sampleConfig: {
      bootstrapServers: 'localhost:9092',
      groupId: 'datastream-cg-1',
      autoOffsetReset: 'earliest',
      enableAutoCommit: false,
    },
  },
  {
    id: 'conn-apache-pulsar',
    name: 'Apache Pulsar Multi-Tenant Connector',
    category: 'PubSub',
    protocol: 'pulsar://',
    defaultPort: 6650,
    description: 'Cloud-native multi-tenant streaming and messaging platform with decoupled compute and storage.',
    capabilities: {
      supportsPartitioning: true,
      supportsOffsetTracking: true,
      supportsReplay: true,
      supportsExactOnce: true,
      supportsSchemaRegistry: true,
      maxThroughputMsgSec: 40000,
    },
    sampleConfig: {
      serviceUrl: 'pulsar://localhost:6650',
      tenant: 'public',
      namespace: 'default',
      subscriptionName: 'sub-datastream',
    },
  },
  {
    id: 'conn-rabbitmq',
    name: 'RabbitMQ AMQP Broker Connector',
    category: 'MessageQueue',
    protocol: 'amqp://',
    defaultPort: 5672,
    description: 'Feature-rich AMQP message broker with flexible routing exchanges and consumer queues.',
    capabilities: {
      supportsPartitioning: false,
      supportsOffsetTracking: true,
      supportsReplay: false,
      supportsExactOnce: false,
      supportsSchemaRegistry: false,
      maxThroughputMsgSec: 25000,
    },
    sampleConfig: {
      host: 'localhost',
      port: 5672,
      virtualHost: '/',
      exchangeName: 'telemetry_exchange',
      routingKey: 'events.game.#',
    },
  },
  {
    id: 'conn-mqtt-broker',
    name: 'MQTT IoT Gateway Connector',
    category: 'IoT',
    protocol: 'mqtt://',
    defaultPort: 1883,
    description: 'Lightweight publish/subscribe messaging protocol for IoT sensors and low-bandwidth telemetry.',
    capabilities: {
      supportsPartitioning: false,
      supportsOffsetTracking: false,
      supportsReplay: false,
      supportsExactOnce: true,
      supportsSchemaRegistry: false,
      maxThroughputMsgSec: 15000,
    },
    sampleConfig: {
      brokerUrl: 'mqtt://localhost:1883',
      qos: 1,
      keepAliveSec: 60,
      topicFilter: 'sensors/factory/+/telemetry',
    },
  },
  {
    id: 'conn-aws-kinesis',
    name: 'AWS Kinesis Data Streams Connector',
    category: 'PubSub',
    protocol: 'kinesis://',
    defaultPort: 443,
    description: 'Scalable cloud stream ingestion service for real-time analytics data pipelines.',
    capabilities: {
      supportsPartitioning: true,
      supportsOffsetTracking: true,
      supportsReplay: true,
      supportsExactOnce: false,
      supportsSchemaRegistry: true,
      maxThroughputMsgSec: 30000,
    },
    sampleConfig: {
      streamName: 'game-telemetry-stream',
      shardCount: 4,
      region: 'us-east-1',
      iteratorType: 'LATEST',
    },
  },
  {
    id: 'conn-debezium-cdc',
    name: 'Debezium Change Data Capture (CDC)',
    category: 'CDC',
    protocol: 'cdc://',
    defaultPort: 8083,
    description: 'Change data capture connector reading database write-ahead logs (WAL) in real-time.',
    capabilities: {
      supportsPartitioning: true,
      supportsOffsetTracking: true,
      supportsReplay: true,
      supportsExactOnce: true,
      supportsSchemaRegistry: true,
      maxThroughputMsgSec: 20000,
    },
    sampleConfig: {
      connectorClass: 'io.debezium.connector.postgresql.PostgresConnector',
      databaseHostname: 'localhost',
      databasePort: 5432,
      databaseUser: 'datastream',
      tableIncludeList: 'public.players,public.transactions',
    },
  },
  {
    id: 'conn-redis-streams',
    name: 'Redis Streams & Consumer Groups',
    category: 'MessageQueue',
    protocol: 'redis://',
    defaultPort: 6379,
    description: 'In-memory log stream data structure with consumer group acknowledgment tracking.',
    capabilities: {
      supportsPartitioning: false,
      supportsOffsetTracking: true,
      supportsReplay: true,
      supportsExactOnce: false,
      supportsSchemaRegistry: false,
      maxThroughputMsgSec: 60000,
    },
    sampleConfig: {
      host: 'localhost',
      port: 6379,
      streamKey: 'mystream:events',
      consumerGroup: 'cg-datastream',
      readBlockMs: 2000,
    },
  },
  {
    id: 'conn-websocket-gateway',
    name: 'WebSocket Live Telemetry Stream',
    category: 'LogStream',
    protocol: 'ws://',
    defaultPort: 8080,
    description: 'Bi-directional full-duplex WebSocket stream connection for continuous client updates.',
    capabilities: {
      supportsPartitioning: false,
      supportsOffsetTracking: false,
      supportsReplay: false,
      supportsExactOnce: false,
      supportsSchemaRegistry: false,
      maxThroughputMsgSec: 10000,
    },
    sampleConfig: {
      url: 'ws://localhost:8080/stream/live',
      reconnectIntervalMs: 5000,
      pingIntervalMs: 30000,
    },
  },
];

export class StreamConnectorManager {
  static getConnectors(): StreamConnectorSpec[] {
    return STREAM_CONNECTORS_CATALOG;
  }

  static getConnectorById(id: string): StreamConnectorSpec | null {
    return STREAM_CONNECTORS_CATALOG.find((c) => c.id === id) || null;
  }

  static getConnectorsByCategory(category: StreamConnectorSpec['category']): StreamConnectorSpec[] {
    return STREAM_CONNECTORS_CATALOG.filter((c) => c.category === category);
  }
}
