import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";
import * as XLSX from "xlsx";

function UserReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam ? record.exam.name : ""}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{record.createdAt ? moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss") : ""}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam ? record.exam.totalMarks : ""}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam ? record.exam.passingMarks : ""}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers ? record.result.correctAnswers.length : ""}</>,
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict ? record.result.verdict : ""}</>,
    },
  ];

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Function to export table data as CSV or Excel
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(
      reportsData.map((report) => ({
        "Exam Name": report.exam ? report.exam.name : "",
        "Date": report.createdAt ? moment(report.createdAt).format("DD-MM-YYYY hh:mm:ss") : "",
        "Total Marks": report.exam ? report.exam.totalMarks : "",
        "Passing Marks": report.exam ? report.exam.passingMarks : "",
        "Obtained Marks": report.result.correctAnswers ? report.result.correctAnswers.length : "",
        "Verdict": report.result.verdict ? report.result.verdict : "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");

    // Export the file as Excel
    XLSX.writeFile(wb, "user-reports.xlsx");
  };

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>
      {/* Button to trigger download */}
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={exportToCSV}
        style={{ marginBottom: 16 }}
      >
        Download
      </Button>
      <Table columns={columns} dataSource={reportsData} />
    </div>
  );
}

export default UserReports;
