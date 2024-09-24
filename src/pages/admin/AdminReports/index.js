import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";
import * as XLSX from "xlsx";
import { DownloadOutlined } from "@ant-design/icons";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => (
        <>{record.result.correctAnswers.length}</>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
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
    getData(filters);
  }, []);

  // Function to export the table data as CSV/Excel
  const exportToCSV = () => {
    const data = reportsData.map((report) => ({
      "Exam Name": report.exam.name,
      "User Name": report.user.name,
      Date: moment(report.createdAt).format("DD-MM-YYYY hh:mm:ss"),
      "Total Marks": report.exam.totalMarks,
      "Passing Marks": report.exam.passingMarks,
      "Obtained Marks": report.result.correctAnswers.length,
      Verdict: report.result.verdict,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reports");

    // Export the file as Excel
    XLSX.writeFile(wb, "admin-reports.xlsx");
  };

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>

      <div className="flex gap-2">
        <Input
          placeholder="Exam Name"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
        />
        <Input
          placeholder="User Name"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
        />
        <Button
          onClick={() => {
            setFilters({ examName: "", userName: "" });
            getData({ examName: "", userName: "" });
          }}
        >
          Clear
        </Button>
        <Button onClick={() => getData(filters)}>Search</Button>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={exportToCSV}
        >
          Download
        </Button>
      </div>

      <Table columns={columns} dataSource={reportsData} className="mt-2" />
    </div>
  );
}

export default AdminReports;
