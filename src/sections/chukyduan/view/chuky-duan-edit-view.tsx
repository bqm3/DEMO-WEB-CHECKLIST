import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetKhuVucDetail, useGetHangMucDetail, useGetCalvDetail, useGetChuKyDuAnDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import CalvNewEditForm from '../chuky-duan-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CalvEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { duankhoicv: currentCycle } = useGetChuKyDuAnDetail(id);

  console.log('currentCycle',currentCycle)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Cập nhật"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Chu kỳ dự án',
            href: paths.dashboard.calv.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CalvNewEditForm currentCycle={currentCycle} />
    </Container>
  );
}
