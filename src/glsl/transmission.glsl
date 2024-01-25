vec3 transmission = vec3(0.0);
float transmissionR, transmissionB, transmissionG;
float randomCoords = rand();
float thickness_smear = thickness * max(pow(roughness, 0.33), anisotropy);
vec3 distortionNormal = vec3(0.0);
vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;
if(distortion > 0.0) {
distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
}
for(float i = 0.0;
i < {
samples }
.0;
i ++) {
vec3 sampleNorm = normalize(n + roughness * roughness * 2.0 * normalize(vec3(rand() - 0.5, rand() - 0.5, rand() - 0.5)) * pow(rand(), 0.33) + distortionNormal);
transmissionR = getIBLVolumeRefraction(sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90, pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness + thickness_smear * (i + randomCoords) / float({
samples }
), material.attenuationColor, material.attenuationDistance).r;
transmissionG = getIBLVolumeRefraction(sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90, pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + chromaticAberration * (i + randomCoords) / float({
samples }
)), material.thickness + thickness_smear * (i + randomCoords) / float({
samples }
), material.attenuationColor, material.attenuationDistance).g;
transmissionB = getIBLVolumeRefraction(sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90, pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float({
samples }
)), material.thickness + thickness_smear * (i + randomCoords) / float({
samples }
), material.attenuationColor, material.attenuationDistance).b;
transmission.r += transmissionR;
transmission.g += transmissionG;
transmission.b += transmissionB;
}
transmission /= {
samples }
.0;
gl_FragColor = vec4(transmission, 1.0);
material.transmissionAlpha = 1.0; //mix( material.transmissionAlpha, transmission.a, material.transmission );
totalDiffuse = mix(totalDiffuse, transmission.rgb, material.transmission);