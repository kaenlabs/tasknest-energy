import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DailyPointsData } from '../context/PointsContext';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 180;
const BAR_SPACING = 6;

interface PointsChartProps {
  data: DailyPointsData[];
}

export const PointsChart: React.FC<PointsChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const { maxValue, minValue, bars } = useMemo(() => {
    const earnedValues = data.map(d => d.earned);
    const lostValues = data.map(d => d.lost);
    const max = Math.max(...earnedValues, ...lostValues, 20); // Min 20 for scale
    const min = 0;

    const barData = data.map((day) => {
      const earnedHeight = (day.earned / max) * CHART_HEIGHT;
      const lostHeight = (day.lost / max) * CHART_HEIGHT;
      
      return {
        date: day.date,
        earned: day.earned,
        lost: day.lost,
        net: day.net,
        earnedHeight,
        lostHeight,
      };
    });

    return { maxValue: max, minValue: min, bars: barData };
  }, [data]);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Dün';
    }

    // Show day name for last 7 days
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    return dayNames[date.getDay()];
  };

  const totalEarned = data.reduce((sum, d) => sum + d.earned, 0);
  const totalLost = data.reduce((sum, d) => sum + d.lost, 0);
  const netPoints = totalEarned - totalLost;

  return (
    <View style={styles.container}>
      {/* Summary Stats */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: '#10B981' }]} />
          <View>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Kazanılan
            </Text>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              +{totalEarned} ⭐
            </Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: '#EF4444' }]} />
          <View>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Kaybedilen
            </Text>
            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
              -{totalLost} ⭐
            </Text>
          </View>
        </View>

        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: theme.primary }]} />
          <View>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Toplam
            </Text>
            <Text style={[styles.summaryValue, { color: theme.primary }]}>
              {netPoints >= 0 ? '+' : ''}{netPoints} ⭐
            </Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <View style={[styles.chartContainer, { backgroundColor: theme.surface }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>
            {maxValue}
          </Text>
          <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>
            {Math.round(maxValue / 2)}
          </Text>
          <Text style={[styles.axisLabel, { color: theme.textSecondary }]}>0</Text>
        </View>

        {/* Bars Container */}
        <View style={styles.barsContainer}>
          {/* Grid lines */}
          <View style={styles.gridLines}>
            <View style={[styles.gridLine, { backgroundColor: theme.border }]} />
            <View style={[styles.gridLine, { backgroundColor: theme.border }]} />
            <View style={[styles.gridLine, { backgroundColor: theme.border }]} />
          </View>

          {/* Bars */}
          <View style={styles.bars}>
            {bars.map((bar, index) => (
              <View
                key={bar.date}
                style={[
                  styles.barColumn,
                  { marginLeft: index === 0 ? 0 : BAR_SPACING },
                ]}
              >
                {/* Earned bar (green) */}
                {bar.earned > 0 && (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: bar.earnedHeight,
                        backgroundColor: '#10B981',
                      },
                    ]}
                  >
                    {bar.earned > 5 && (
                      <Text style={styles.barLabel}>+{bar.earned}</Text>
                    )}
                  </View>
                )}

                {/* Lost bar (red) */}
                {bar.lost > 0 && (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: bar.lostHeight,
                        backgroundColor: '#EF4444',
                        marginTop: bar.earned > 0 ? 2 : 0,
                      },
                    ]}
                  >
                    {bar.lost > 5 && (
                      <Text style={styles.barLabel}>-{bar.lost}</Text>
                    )}
                  </View>
                )}

                {/* Empty state */}
                {bar.earned === 0 && bar.lost === 0 && (
                  <View style={[styles.emptyBar, { backgroundColor: theme.border }]} />
                )}
              </View>
            ))}
          </View>

          {/* X-axis labels */}
          <View style={styles.xAxis}>
            {bars.map((bar) => (
              <Text
                key={bar.date}
                style={[
                  styles.xAxisLabel,
                  { color: theme.textSecondary },
                ]}
              >
                {formatDate(bar.date)}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  chartContainer: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingVertical: 4,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  barsContainer: {
    flex: 1,
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  gridLine: {
    height: 1,
    opacity: 0.2,
  },
  bars: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 4,
  },
  emptyBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  barLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  xAxisLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
