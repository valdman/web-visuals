import {Complex} from '@/web/complex';

type ZoomTransform = {x: number; y: number; k: number};

export function transformToComplexCoordinates(width: number, {x, k, y}: ZoomTransform): Complex {
    const x_img_zoomed_coords = (x / width - 0.5) / k;
    const y_img_zoomed_coords = (y / width - 0.5) / k;
    const x_fract_coords = x_img_zoomed_coords + 0.5;
    const y_fract_coords = y_img_zoomed_coords + 0.5;

    return [-x_fract_coords, y_fract_coords];
}

export function complextoZoomTransform(width: number, k: number, [r, i]: Complex): ZoomTransform {
    return {
        k,
        x: -0.5 * width * (2 * r * k + k - 1),
        y: 0.5 * width * (2 * r * k - k + 1),
    };
}
