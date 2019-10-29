## QSLIDER  | 2.0.1

## Installation

`` npm i @imagina/qslider@2.0.1``

## API Routes

| ENTITY  | ROUTE |
| ------------- | ------------- |
| Sliders | apiRoutes.qslider.sliders |
| Slides | apiRoutes.qslider.slides |

## Pages

- ### Back-End

  | PAGE | NAME |
  | ------------- | ------------- |
  | Sliders Index | qslider.admin.sliders |
 
### Component: carousel
- #### Usage 

    ```js
    import carouselComponent from '@imagina/qslider/_components/carousel';
    
    export default {
    components: {
     carouselComponent
    }
    };
    ```
 
    ```html
    <carousel-component id="[id slider]"></carousel-component>
    ```
