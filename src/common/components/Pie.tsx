import { data, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { getData } from "../../api/dataAPI";

export interface PIE_DATA {
  id: string;
  options?: {
    title: {
      text: string;
      icon?: string;
      click: string;
    };
    chart: {
      displayLegend: boolean;
      legendPosition?: "top" | "bottom" | "left" | "right";
      legendAlign?: "start" | "center" | "end";
    };
  };
  data?: {
    apiUrl?: string;
    chart: PIE_API_RESPONSE_MODEL[];
  };
  styles?: {
    card?: React.CSSProperties;
    cardBody?: React.CSSProperties;
    title?: React.CSSProperties;
    chart?: React.CSSProperties;
    labels?: React.CSSProperties;
    legend?: {
      padding?: number;
      boxWidth?: number;
      usePointStyle?: boolean;
    };
  };
}

export interface PIE_API_RESPONSE_MODEL {
  labels: string;
  values: number;
  backgroundColor: string;
  hoverBackgroundColor: string;
}

function Pie(props: PIE_DATA) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const defaultStyles = {
    card: { border: "1px solid #e0e0e0", borderRadius: "8px" },
    cardBody: { padding: "15px" },
    title: {
      fontWeight: "bold",
      fontSize: "18px",
      color: "#333",
      marginBottom: "15px",
    },
    chart: { width: "100%" },
  };

  const styles = {
    card: { ...defaultStyles.card, ...props.styles?.card },
    cardBody: { ...defaultStyles.cardBody, ...props.styles?.cardBody },
    title: { ...defaultStyles.title, ...props.styles?.title },
    chart: { ...defaultStyles.chart, ...props.styles?.chart },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: PIE_API_RESPONSE_MODEL[] = await getData(
          props?.data?.apiUrl || " "
        );
        if (response) {
          formatChartData(response);
        }
      } catch (err) {
        console.error("failed to load chart data", err);
      }
    };
    fetchData();
  }, []);

  const formatChartData = (chartValues: PIE_API_RESPONSE_MODEL[]) => {
    if (!Array.isArray(chartValues)) {
      console.error("Invalid chart data structure", chartValues);
      return;
    }
    const data = {
      labels: chartValues.map((item: { labels: string }) => item.labels),
      datasets: [
        {
          data: chartValues.map((item: { values: number }) => item.values),
          backgroundColor: chartValues.map(
            (item: { backgroundColor: string }) => item.backgroundColor
          ),
          hoverBackgroundColor: chartValues.map(
            (item: { hoverBackgroundColor: string }) =>
              item.hoverBackgroundColor
          ),
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: props.options?.chart.displayLegend ?? true,
          position: props.options?.chart.legendPosition || "top",
          align: props.options?.chart.legendAlign || "center",
          labels: {
            boxWidth: props.styles?.legend?.boxWidth || 8,
            usePointStyle: props.styles?.legend?.usePointStyle ?? true,
            padding: props.styles?.legend?.padding || 5,
            font: props.styles?.labels
              ? {
                  size:
                    parseInt(props.styles.labels.fontSize as string) ||
                    undefined,
                  weight: props.styles.labels.fontWeight as string,
                }
              : undefined,
            color: props.styles?.labels?.color,
          },
        },
      },
    };
    setChartData(data);
    setChartOptions(options);
  };

  return (
    <div className="card" style={styles.card}>
      <div className="card-body" style={styles.cardBody}>
        <div style={{ overflow: "hidden" }}>
          <Link
            to={props.options?.title.click || "#"}
            className="card-body-title"
            style={styles.title}
          >
            {props.options?.title.text}
          </Link>
          <div style={{ overflow: "hidden" }}>
            <Chart
              type="pie"
              data={chartData}
              options={{
                ...chartOptions,
                maintainAspectRatio: true,
                responsive: true,
              }}
              className="w-full md:w-30rem"
              style={styles.chart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pie;
