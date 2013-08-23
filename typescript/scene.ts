/// <reference path="./common.ts"/>

/*
<svg id="context" width="688" height="350">
    <g id="obstacles"></g>
    <g id="innerOrbits"></g>
    <g id="outerOrbits"></g>
    <g id="tracks"></g>
    <g id="labels"></g>
</svg>
*/

module scene {

    import g = geometry;
    import c = constants;
    
    export interface SceneConfig {
        parent: Element;
        width: number;
        height: number;
    }

    export class Scene {

        public groups : {
            obstacles :Element;
            innerOrbits :Element;
            outerOrbits :Element;
            tracks :Element;
            labels :Element;
        };

        constructor (config:SceneConfig) {
            
            var svg :Element = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            svg.setAttribute("width", config.width.toString());
            svg.setAttribute("height", config.height.toString());
            config.parent.appendChild(svg);
            
            var obstacles = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            obstacles.setAttribute("class", "obstacles");
            svg.appendChild(obstacles);
            
            var innerOrbits = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            innerOrbits.setAttribute("class", "innerOrbits");
            svg.appendChild(innerOrbits);
            
            var outerOrbits = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            outerOrbits.setAttribute("class", "outerOrbits");
            svg.appendChild(outerOrbits);
            
            var tracks = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            tracks.setAttribute("class", "tracks");
            svg.appendChild(tracks);
            
            var labels = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            labels.setAttribute("class", "labels");
            svg.appendChild(labels);
            
            this.groups = {
                obstacles: obstacles,
                innerOrbits: innerOrbits,
                outerOrbits: outerOrbits,
                tracks: tracks,
                labels: labels,
            };
        }
    }
}