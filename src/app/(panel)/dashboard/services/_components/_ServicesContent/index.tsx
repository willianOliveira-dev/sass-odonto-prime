'use service';

import { LabelSubscription } from '@/components/ui/labelSubscription';
import { getAllServices } from '../../_data-access-layer/get-all-services';
import { ServicesList } from '../_ServicesList';
import { canPermissions } from '@/helpers/plans/permissions/canPermissions';

interface ServicesComponentProps {
    userId: string;
}

const delay = async (ms: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export async function ServicesContent({ userId }: ServicesComponentProps) {
    const services = await getAllServices({ userId });
    const permission = await canPermissions({ type: 'service' });

    return (
        <>
            {!permission.hasPermission && (
                <LabelSubscription expired={permission.expired} />
            )}

            <ServicesList
                services={services.data || []}
                permission={permission}
            />
        </>
    );
}
