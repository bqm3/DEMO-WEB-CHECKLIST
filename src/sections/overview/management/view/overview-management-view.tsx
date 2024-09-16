import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import { Box, TextField } from '@mui/material';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Iconify from 'src/components/iconify';
import Button from '@mui/material/Button';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
  _ecommerceSalesOverview,
  _appInstalled,
  _bankingRecentTransitions,
} from 'src/_mock';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// hooks
import { useAuthContext } from 'src/auth/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
// api
import axios from 'axios';
import { useGetKhoiCV } from 'src/api/khuvuc';
//
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AppCurrentDownload from '../app-current-download';
import ChecklistsHoanThanh from '../checklist-hoan-thanh';
import ChecklistsSuCo from '../checklist-su-co';
import ChecklistsSuCoNgoai from '../checklist-su-co-ngoai';
import EcommerceSalesOverview from '../checklist-percent-overview';
import BankingRecentTransitions from '../banking-recent-transitions';
import AnaLyticsDuan from '../analytics-areas';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';

type SeriesData = {
  label: string;
  value: number;
};

type SeriesDataYear = {
  name: string;
  data: number[];
};

type ChartSeries = {
  type: string;
  data: SeriesDataYear[];
};

type ChartData = {
  categories: string[];
  series: ChartSeries[];
};

const columns: GridColDef<[number]>[] = [
  { field: 'id',headerName:'Mã dự án', width: 0 },
  {
    field: 'projectName',
    headerName: 'Tên dự án',
    width: 200,
    editable: true,
  },
  {
    field: 'Khối kỹ thuật',
    headerName: 'Khối kỹ thuật',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối làm sạch',
    headerName: 'Khối làm sạch',
    // type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối dịch vụ',
    headerName: 'Khối dịch vụ',
    width: 150,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
  {
    field: 'Khối bảo vệ',
    headerName: 'Khối bảo vệ',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 160,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
];

const months = [
  { value: 'all', label: 'Tất cả' },
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
]

const nhoms = [
  { value: 'all', label: 'Tất cả' },
  { value: '1', label: 'Nhóm A' },
  { value: '2', label: 'Nhóm B' },
  { value: '3', label: 'Nhóm C' },
  { value: '4', label: 'Nhóm D' },
]

const tangGiam = [
  { value: 'desc', label: 'Giảm' },
  { value: 'asc', label: 'Tăng' },
]

const top = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
]

export default function OverviewAnalyticsView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user, logout } = useAuthContext();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [dataDuan, setDataDuan] = useState<any>([]);
  const [dataPercent, setDataPercent] = useState<any>([]);

  const [dataTotalErrorWeek, setDataTotalErrorWeek] = useState<any>([]);
  const [dataTotalYear, setDataTotalYear] = useState<ChartData>({ categories: [], series: [] });
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState(`all`);
  const [selectedKhoiCV, setSelectedKhoiCV] = useState('all');
  const [selectedNhom, setSelectedNhom] = useState('4');
  const [selectedTangGiam, setSelectedTangGiam] = useState('asc');
  const [selectedTop, setSelectedTop] = useState('5');

  // ===========================
  const [dataTotalYearSuco, setDataTotalYearSuco] = useState<ChartData>({ categories: [], series: [] });
  const [selectedYearSuco, setSelectedYearSuco] = useState('2024');
  const [selectedMonthSuco, setSelectedMonthSuco] = useState(`all`);
  const [selectedKhoiCVSuco, setSelectedKhoiCVSuco] = useState('all');
  const [selectedNhomSuco, setSelectedNhomSuco] = useState('4');
  const [selectedTangGiamSuco, setSelectedTangGiamSuco] = useState('desc');
  const [selectedTopSuco, setSelectedTopSuco] = useState('5');

  // ===============

  const [dataTotalYearSuCoNgoai, setDataTotalYearSuCoNgoai] = useState<ChartData>({ categories: [], series: [] });
  const [selectedYearSuCoNgoai, setSelectedYearSuCoNgoai] = useState('2024');
  const [selectedMonthSuCoNgoai, setSelectedMonthSuCoNgoai] = useState(`all`);
  const [selectedKhoiCVSuCoNgoai, setSelectedKhoiCVSuCoNgoai] = useState('all');
  const [selectedNhomSuCoNgoai, setSelectedNhomSuCoNgoai] = useState('4');
  const [selectedTangGiamSuCoNgoai, setSelectedTangGiamSuCoNgoai] = useState('desc');
  const [selectedTopSuCoNgoai, setSelectedTopSuCoNgoai] = useState('5');

  const { khoiCV } = useGetKhoiCV();

  const STATUS_OPTIONS = useMemo(
    () => [
      { value: 'all', label: 'Tất cả' },
      ...khoiCV.map((khoi) => ({
        value: khoi.ID_KhoiCV.toString(),
        label: khoi.KhoiCV,
      })),
    ],
    [khoiCV]
  );

  useEffect(() => {
    const handleDataDuan = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/demo/api/ent_duan/du-an-theo-nhom', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataDuan(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataDuan();
  }, [accessToken]);

  useEffect(() => {
    const handleDataPercent = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/demo/api/tb_checklistc/list-project-none', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const dataRes = res.data.data;
          const transformedRows = dataRes.map((project: any) => ({
            id: project.projectId,
            projectName: project.projectName,
            'Khối kỹ thuật': project.createdKhois['Khối kỹ thuật']?.completionRatio ? `${project.createdKhois['Khối kỹ thuật']?.completionRatio} %` : null,
            'Khối làm sạch': project.createdKhois['Khối làm sạch']?.completionRatio ? `${project.createdKhois['Khối làm sạch']?.completionRatio} %` : null,
            'Khối dịch vụ': project.createdKhois['Khối dịch vụ']?.completionRatio ? `${project.createdKhois['Khối dịch vụ']?.completionRatio} %` : null,
            'Khối bảo vệ': project.createdKhois['Khối bảo vệ']?.completionRatio ? `${project.createdKhois['Khối bảo vệ']?.completionRatio} %` : null, 
          }));
      
          setDataPercent(transformedRows);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataPercent();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/demo/api/tb_checklistc/list-checklist-error', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          setDataTotalErrorWeek(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/demo/api/tb_checklistc/ti-le-hoan-thanh?
          year=${selectedYear}&khoi=${selectedKhoiCV}&month=${selectedMonth}&nhom=${selectedNhom}&tangGiam=${selectedTangGiam}&top=${selectedTop}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          setDataTotalYear(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken, selectedYear, selectedKhoiCV, selectedMonth, selectedNhom, selectedTangGiam,selectedTop]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/demo/api/tb_checklistc/ti-le-su-co?
          year=${selectedYearSuco}&khoi=${selectedKhoiCVSuco}&month=${selectedMonthSuco}&nhom=${selectedNhomSuco}&tangGiam=${selectedTangGiamSuco}&top=${selectedTopSuco}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          setDataTotalYearSuco(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken, selectedYearSuco, selectedKhoiCVSuco, selectedMonthSuco, selectedNhomSuco, selectedTangGiamSuco, selectedTopSuco]);

   // Sự cố ngoài
   useEffect(() => {
    const handleTangGiam = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/demo/api/tb_sucongoai/dashboard?year=${selectedYearSuCoNgoai}&khoi=${selectedKhoiCVSuCoNgoai}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setDataTotalYearSuCoNgoai(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTangGiam();
  }, [accessToken, selectedYearSuCoNgoai, selectedKhoiCVSuCoNgoai, selectedTangGiamSuCoNgoai]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, {user?.Hoten} {user?.ent_chucvu?.Chucvu ? `(${user?.ent_chucvu?.Chucvu})` : ''}
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} md={12} lg={12}>
          <div>
            {Object.keys(dataDuan)
              .sort((a, b) => b.localeCompare(a))
              .map((groupName) => (
                <Accordion key={groupName}>
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    aria-controls={`${groupName}-content`}
                    id={`${groupName}-header`}
                    sx={{ fontWeight: '700' }}
                  >
                    {groupName}
                  </AccordionSummary>
                  <AccordionDetails>
                    <AnaLyticsDuan
                      title={`Thông tin các dự án thuộc ${groupName}`}
                      list={dataDuan[groupName]}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
          </div>
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <Box sx={{ maxHeight: 400, width: '100%', my: 3 }}>
            <Typography sx={{pb: 1.5, fontWeight: '600', fontSize: 18}}>Tỉ lệ hoàn thành checklist hôm qua</Typography>
            <DataGrid
              rows={dataPercent}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
              }}
              
              pageSizeOptions={[20, 30, 50]}
              disableRowSelectionOnClick
            />
          </Box>
        </Grid>

        <Grid xs={12} md={12} lg={6}>
          <ChecklistsHoanThanh
            title="Tỉ lệ hoàn thành checklist "
            subheader="Hoàn thành checklist theo ca"
            chart={{
              categories: dataTotalYear.categories,
              series: dataTotalYear.series,
            }}
            selectedYear={selectedYear}
            selectedKhoiCV={selectedKhoiCV}
            selectedMonth={selectedMonth}
            selectedTangGiam={selectedTangGiam}
            selectedNhom={selectedNhom}
            selectedTop={selectedTop}

            onYearChange={setSelectedYear}
            onTangGiamChange={setSelectedTangGiam}
            onNhomChange={setSelectedNhom}
            onKhoiChange={setSelectedKhoiCV}
            onMonthChange={setSelectedMonth}
            onTopChange={setSelectedTop}
        
            STATUS_OPTIONS={STATUS_OPTIONS}
            months={months}
            nhoms={nhoms}
            tangGiam={tangGiam}
            top={top}
          />
        </Grid>
        <Grid xs={12} md={12} lg={6}>
          <ChecklistsSuCo
            title="Sự cố"
            subheader="Số lượng sự cố chưa hoàn thành"
            chart={{
              categories: dataTotalYearSuco.categories,
              series: dataTotalYearSuco.series,
            }}
            selectedYear={selectedYearSuco}
            selectedKhoiCV={selectedKhoiCVSuco}
            selectedTangGiam={selectedTangGiamSuco}
            selectedTop={selectedTopSuco}
            selectedNhom={selectedNhomSuco}
            selectedMonth={selectedMonthSuco}

            onYearChange={setSelectedYearSuco}
            onTangGiamChange={setSelectedTangGiamSuco}
            onKhoiChange={setSelectedKhoiCVSuco}
            onNhomChange={setSelectedNhomSuco}
            onTopChange={setSelectedTopSuco}
            onMonthChange={setSelectedMonthSuco}
        
            STATUS_OPTIONS={STATUS_OPTIONS}
            months={months}
            nhoms={nhoms}
            tangGiam={tangGiam}
            top={top}
          />
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <ChecklistsSuCoNgoai
            title="Sự cố ngoài"
            chart={{
              categories: dataTotalYearSuCoNgoai.categories,
              series: dataTotalYearSuCoNgoai.series,
            }}
            selectedYear={selectedYearSuCoNgoai}
            selectedKhoiCV={selectedKhoiCVSuCoNgoai}
            selectedTangGiam={selectedTangGiamSuCoNgoai}

            onYearChange={setSelectedYearSuCoNgoai}
            onTangGiamChange={setSelectedTangGiamSuCoNgoai}
            onKhoiChange={setSelectedKhoiCVSuCoNgoai}

            STATUS_OPTIONS={STATUS_OPTIONS}
            tangGiam={tangGiam}
          />
        </Grid>
        
        <Grid xs={12} md={12} lg={12}>
        {dataTotalErrorWeek && (
            <BankingRecentTransitions
              title="Sự cố ngày hôm trước"
              tableData={dataTotalErrorWeek}
              tableLabels={[
                { id: 'checklistName', label: 'Tên checklist' },
                { id: 'Ngay', label: 'Ngày' },
                { id: 'note', label: 'Ghi chú' },
                { id: 'image', label: 'Ảnh' },
                { id: 'duan', label: 'Dự án' },
                { id: '' },
              ]}
            />
          )}  
        </Grid>
      </Grid>
    </Container>
  );
}
