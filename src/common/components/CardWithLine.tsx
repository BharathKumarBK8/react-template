import { Link } from "react-router-dom";
import {
  CARD_WITH_LINE_DATA,
  CWL_API_RESPONSE_MODEL,
} from "../../models/pageModel";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { getData } from "../../api/dataAPI";

function CardWithLine(props: CARD_WITH_LINE_DATA) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [values, setValues] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: CWL_API_RESPONSE_MODEL = await getData(
          props.data?.apiUrl || " "
        );
        if (response) {
          createChart(response);
          setValues(response.value || null);
          setPercentage(response.percentage || null);
        }
      } catch (err) {
        console.error("failed to load chart data", err);
      }
    };
    fetchData();
  }, []);

  const createChart = (chartValues: CWL_API_RESPONSE_MODEL) => {
    const bgColor = props.options?.bgcolor || ["#2196F3", "#4CAF50", "#E3F2FD"];

    const Data = [
      chartValues.data[0],
      chartValues.data[1],
      chartValues.data[2],
    ];

    const data = {
      labels: Data[0],
      datasets: [
        {
          data: Data[0],
          fill: false,
          borderDash: props.options?.chartStyles?.borderDash || [2, 4],
          tension: props.options?.chartStyles?.tension || 0.4,
          borderColor: props.options?.chartStyles?.borderColor || bgColor[1],
          borderWidth: props.options?.chartStyles?.borderWidth || 2,
          pointStyle: props.options?.chartStyles?.pointStyle || false,
        },
        {
          data: Data[1],
          fill: true,
          tension: props.options?.chartStyles?.tension || 0.4,
          borderColor:
            props.options?.chartStyles?.secondaryBorderColor || bgColor[0],
          borderWidth: props.options?.chartStyles?.secondaryBorderWidth || 2,
          backgroundColor: (context: any) => {
            const { ctx } = context.chart;
            const gradientBg = ctx.createLinearGradient(0, 0, 0, 25);
            gradientBg.addColorStop(0, bgColor[1]);
            gradientBg.addColorStop(1, bgColor[2]);

            return gradientBg;
          },
          pointStyle: props.options?.chartStyles?.secondaryPointStyle || false,
        },
      ],
    };
    const options = {
      maintainAspectRatio: true,
      aspectRatio: props.options?.chartStyles?.aspectRatio || 3,
      plugins: {
        legend: {
          display: props.options?.chart?.displayLegend || false,
        },
        tooltip: {
          enabled: props.options?.chartStyles?.tooltipEnabled || false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  };

  return (
    <>
      <div className="card" style={props.options?.styles?.card}>
        <div className="card-body" style={props.options?.styles?.cardBody}>
          <Link
            to="#"
            className="card-body-title"
            style={props.options?.styles?.title}
          >
            {props.options?.title.text}
          </Link>
          <div className="row align-items-center">
            <div
              className="col-md-7"
              style={props.options?.styles?.valueSection}
            >
              <span className="val" style={props.options?.styles?.value}>
                <span className="val">{values}</span>
                {percentage && (
                  <span
                    className="percentage"
                    style={props.options?.styles?.percentage}
                  >
                    {percentage}
                  </span>
                )}
              </span>
            </div>
            <div
              className="col-md-5"
              style={props.options?.styles?.chartSection}
            >
              {chartData && chartOptions && (
                <Chart type="line" data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CardWithLine;
