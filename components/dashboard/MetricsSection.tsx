import React from 'react';
import StatCard from './StatCard';
import { FaStar, FaThumbsUp, FaCalendarTimes } from 'react-icons/fa';

interface MetricsSectionProps {
  metrics: {
    averageRating: number;
    totalReviews: number;
    responseRate: number;
    cancellationRate: number;
  };
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ metrics }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-600 mb-4">Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Average Rating"
          value={metrics.averageRating.toFixed(1)}
          description={`From ${metrics.totalReviews} reviews`}
          icon={<FaStar />}
          variant="warning"
          leftBorder
        />
        <StatCard
          title="Response Rate"
          value={`${metrics.responseRate}%`}
          description="Client message responses"
          icon={<FaThumbsUp />}
          variant="success"
          leftBorder
        />
        <StatCard
          title="Cancellation Rate"
          value={`${metrics.cancellationRate}%`}
          description="Last-minute cancellations"
          icon={<FaCalendarTimes />}
          variant="danger"
          leftBorder
        />
      </div>
    </div>
  );
};

export default MetricsSection; 