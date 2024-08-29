import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IOrderItem } from 'src/types/order';
import { IKhuvuc, IHangMuc, IChecklist, ICalv, IKhoiCV } from 'src/types/khuvuc';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  row: IChecklist;
  calv: ICalv[];
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  khoiCV: IKhoiCV[];
};

export default function AreaTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  calv,
  khoiCV,
}: Props) {
  const {
    ID_Checklist,
    ID_Khuvuc,
    ID_Hangmuc,
    Checklist,
    Giatridinhdanh,
    Giatrinhan,
    Tieuchuan,
    MaQrCode,
    ent_hangmuc,
    ent_tang,
    Sothutu,
    Maso,
    sCalv,
    calv_1,
    calv_2,
    calv_3,
    calv_4,
    ent_calv,
    Tinhtrang,
    ent_khuvuc,
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const sCalvNew = `${sCalv}`;
  let arrNew : any[] = [];

  // Kiểm tra nếu sCalv là chuỗi
  if (typeof sCalvNew === 'string') {
    try {
      const array = sCalvNew.split(',').map((item) => parseInt(item.trim(), 10));

      // Kiểm tra nếu kết quả là mảng
      if (Array.isArray(array)) {
        arrNew = array;
      } else {
        console.error('Parsed result is not an array:', array);
      }
    } catch (error) {
      // Xử lý lỗi phân tích JSON
      console.error('Error parsing JSON:', error);
    }
  } else {
    console.log('sCalv is not a string:', typeof sCalv);
  }

  const shiftNames = arrNew
    ?.map((calvId) => {
      // Tìm ca làm việc trong sCalv bằng ID_Calv
      const workShift = calv?.find((shift) => `${shift.ID_Calv}` === `${calvId}`);
      // Nếu tìm thấy, trả về tên của ca làm việc
      return workShift ? workShift.Tenca : null;
    })
    // Lọc ra các phần tử null trong trường hợp ID_Calv không tồn tại trong sCalv
    .filter((name) => name !== null);

  // Tạo các nhãn từ mảng các tên ca làm việc
  const labels = shiftNames.map((name, index) => (
    <Label key={index} variant="soft" color="info" style={{ marginTop: 2 }}>
      {name}
    </Label>
  ));

  let ID_KhoiCVsArray: number[];

  // Kiểm tra xem ID_KhoiCVs là một mảng hoặc không
  if (Array.isArray(ent_khuvuc.ID_KhoiCVs)) {
    // Kiểm tra xem các phần tử trong mảng có phải là số không và chuyển đổi
    ID_KhoiCVsArray = ent_khuvuc.ID_KhoiCVs.filter((item) => typeof item === 'number').map(Number);
  } else if (typeof ent_khuvuc.ID_KhoiCVs === 'string') {
    // Chuyển đổi từ chuỗi sang mảng số
    ID_KhoiCVsArray = ent_khuvuc.ID_KhoiCVs.replace(/\[|\]/g, '') // Loại bỏ dấu ngoặc vuông
      .split(', ') // Phân tách các số
      .map((item) => Number(item?.trim())) // Chuyển đổi từ chuỗi sang số
      .filter((item) => !Number.isNaN(item)); // Loại bỏ các giá trị không hợp lệ
  } else {
    // Trong trường hợp ID_KhoiCVs không phải là mảng hoặc chuỗi, ta gán một mảng rỗng
    ID_KhoiCVsArray = [];
  }

  const shiftNamesKhoiCV = ent_khuvuc.ent_khuvuc_khoicvs
    .map((calvId) => {
      const workShift = khoiCV?.find((shift) => `${shift.ID_KhoiCV}` === `${calvId.ID_KhoiCV}`);
      return workShift ? calvId.ent_khoicv.KhoiCV : null;
    })
    .filter((name) => name !== null);

  const labelsKhoiCV = shiftNamesKhoiCV.map((name, index) => (
    <Label
      key={index}
      variant="soft"
      color={
        (`${name}` === 'Khối làm sạch' && 'success') ||
        (`${name}` === 'Khối kỹ thuật' && 'warning') ||
        (`${name}` === 'Khối bảo vệ' && 'error') ||
        'default'
      }
      style={{ marginTop: 4 }}
    >
      {name}
    </Label>
  ));

  const renderPrimary = (
    <TableRow
      hover
      selected={selected}
      style={{ backgroundColor: `${Tinhtrang}` === '1' ? '#FF563029' : '' }}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          C{ID_Checklist}
        </Box>
      </TableCell>
      <TableCell>
        <ListItemText primary={Checklist} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>
      <TableCell align="center"> {Giatridinhdanh} </TableCell>
      <TableCell align="center"> {Giatrinhan} </TableCell>
      <TableCell align="center">
        {' '}
        <ListItemText
          primary={ent_hangmuc?.Hangmuc}
          secondary={ent_hangmuc?.MaQrCode}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell align="center" sx={{flexDirection:'row'}}>{labels}</TableCell>
      <TableCell align="center"> {labelsKhoiCV} </TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Xem
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="PMC thông báo"
        content="Bạn có thực sự muốn xóa không?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xóa
          </Button>
        }
      />
    </>
  );
}
