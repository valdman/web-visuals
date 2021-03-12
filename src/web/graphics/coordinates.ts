import {Complex} from '@/web/complex';

type ZoomTransform = {x: number; y: number; k: number};

export function transformToComplexCoordinates(width: number, {x, k, y}: ZoomTransform): Complex {
    const x_img_coords = (x / k) * 1.0;
    const y_img_coords = (y / k) * 1.0;
    const x_fract_coords = -x_img_coords / width;
    const y_fract_coords = y_img_coords / width;

    return [x_fract_coords, y_fract_coords];
}

export function complextoZoomTransform(width: number, k: number, [r, i]: Complex): ZoomTransform {
    return {x: -r * width * k, y: i * width * k, k};
}
