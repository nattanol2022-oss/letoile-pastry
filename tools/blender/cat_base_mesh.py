import bpy
import math
from mathutils import Vector


# Cute stylized cat base mesh made from simple primitives.
# Run this file from Blender's Scripting workspace or with:
# blender --background --python cat_base_mesh.py


def material(name, color, roughness=0.65):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
        bsdf.inputs["Roughness"].default_value = roughness
    return mat


CREAM = material("Fur - warm cream", (0.88, 0.68, 0.46))
CREAM_LIGHT = material("Muzzle and paws", (1.0, 0.84, 0.64))
ORANGE = material("Calico orange", (0.82, 0.28, 0.08))
DARK = material("Calico charcoal", (0.08, 0.07, 0.08))
PINK = material("Inner ears and nose", (0.95, 0.35, 0.40))
EYE = material("Eyes", (0.08, 0.035, 0.015), 0.3)


def apply_material(obj, mat):
    obj.data.materials.append(mat)
    return obj


def smooth(obj):
    if hasattr(obj.data, "polygons"):
        for poly in obj.data.polygons:
            poly.use_smooth = True
    return obj


def uv_sphere(name, location, scale, mat=CREAM, segments=32, rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments, ring_count=rings, location=location
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    smooth(obj)
    return apply_material(obj, mat)


def cylinder(name, location, radius, depth, mat=CREAM, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=32, radius=radius, depth=depth, location=location, rotation=rotation
    )
    obj = bpy.context.object
    obj.name = name
    bevel = obj.modifiers.new("Soft bevel", "BEVEL")
    bevel.width = radius * 0.22
    bevel.segments = 3
    smooth(obj)
    return apply_material(obj, mat)


def cone(name, location, radius1, radius2, depth, mat=CREAM, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=32,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    bevel = obj.modifiers.new("Soft bevel", "BEVEL")
    bevel.width = 0.07
    bevel.segments = 3
    smooth(obj)
    return apply_material(obj, mat)


def point_camera_at(camera, target):
    camera.rotation_euler = (Vector(target) - camera.location).to_track_quat(
        "-Z", "Y"
    ).to_euler()


def create_cat():
    # Remove the default scene so the script is repeatable.
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    # Low, wide body with the head pushed forward into the shoulder line.
    uv_sphere("Body", (0.0, 0.0, 1.38), (1.48, 0.82, 1.08))
    uv_sphere("Chest fluff", (0.82, -0.60, 1.48), (0.72, 0.24, 0.88), CREAM_LIGHT)
    uv_sphere("Head", (1.08, -0.10, 2.18), (0.88, 0.78, 0.82))

    # Triangular ears, with smaller pink inner-ear pieces.
    for side in (-1, 1):
        x = 1.08 + side * 0.52
        ear = cone(
            "Ear L" if side < 0 else "Ear R",
            (x, -0.10, 2.88),
            0.46,
            0.02,
            0.92,
            CREAM,
            rotation=(0.0, side * math.radians(14), 0.0),
        )
        inner = cone(
            "Inner ear L" if side < 0 else "Inner ear R",
            (x, -0.51, 2.87),
            0.27,
            0.01,
            0.55,
            PINK,
            rotation=(0.0, side * math.radians(14), 0.0),
        )

    # Muzzle, nose, and large friendly eyes.
    uv_sphere("Muzzle L", (0.82, -0.78, 1.98), (0.34, 0.18, 0.26), CREAM_LIGHT)
    uv_sphere("Muzzle R", (1.34, -0.78, 1.98), (0.34, 0.18, 0.26), CREAM_LIGHT)
    uv_sphere("Nose", (1.08, -0.96, 2.03), (0.12, 0.08, 0.09), PINK)
    for side in (-1, 1):
        uv_sphere(
            "Eye L" if side < 0 else "Eye R",
            (1.08 + side * 0.30, -0.82, 2.39),
            (0.14, 0.10, 0.18),
            EYE,
        )
        uv_sphere(
            "Eye highlight L" if side < 0 else "Eye highlight R",
            (1.08 + side * 0.26, -0.91, 2.47),
            (0.035, 0.025, 0.045),
            CREAM_LIGHT,
            16,
            10,
        )

    # Four short, thick legs and rounded paws, with the rear pair tucked back.
    for index, (x, y) in enumerate(
        ((0.76, -0.43), (0.76, 0.43), (-0.82, -0.43), (-0.82, 0.43))
    ):
        cylinder(
            "Leg %02d" % (index + 1),
            (x, y, 0.72),
            0.28,
            0.92,
            CREAM_LIGHT,
        )
        uv_sphere(
            "Paw %02d" % (index + 1),
            (x, y - 0.08, 0.28),
            (0.34, 0.38, 0.24),
            CREAM_LIGHT,
        )

    # Full haunches round out the standing silhouette.
    for side in (-1, 1):
        uv_sphere(
            "Haunch L" if side < 0 else "Haunch R",
            (-0.84, side * 0.35, 1.12),
            (0.62, 0.52, 0.72),
            CREAM,
        )

    # Upright, gently curled tail rising from the rear of the body.
    tail_points = [
        (-1.28, 0.18, 1.32, 0.44),
        (-1.62, 0.18, 1.72, 0.40),
        (-1.68, 0.18, 2.18, 0.34),
        (-1.53, 0.18, 2.62, 0.29),
        (-1.28, 0.18, 2.92, 0.23),
    ]
    for index, (x, y, z, radius) in enumerate(tail_points):
        uv_sphere(
            "Tail segment %02d" % (index + 1),
            (x, y, z),
            (radius, radius, radius),
            CREAM,
        )

    # Simple calico patches placed slightly in front of the base forms.
    uv_sphere("Orange forehead patch", (0.85, -0.80, 2.66), (0.30, 0.05, 0.25), ORANGE)
    uv_sphere("Dark forehead patch", (1.36, -0.80, 2.67), (0.26, 0.05, 0.28), DARK)
    uv_sphere("Orange body patch", (0.20, -0.78, 1.72), (0.30, 0.07, 0.40), ORANGE)
    uv_sphere("Dark body patch", (-0.70, -0.78, 1.55), (0.25, 0.07, 0.34), DARK)
    uv_sphere("Orange tail patch", (-1.60, 0.05, 2.00), (0.16, 0.16, 0.19), ORANGE)

    # A ground disc makes the model easier to inspect in the viewport.
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=64, radius=2.35, depth=0.08, location=(0, 0, 0.04)
    )
    ground = bpy.context.object
    ground.name = "Display ground"
    apply_material(ground, material("Ground", (0.12, 0.08, 0.07)))

    # Organize the generated objects for easy selection and posing.
    cat_collection = bpy.data.collections.get("Stylized Cat") or bpy.data.collections.new(
        "Stylized Cat"
    )
    if cat_collection not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(cat_collection)
    for obj in list(bpy.context.scene.objects):
        if obj != ground and obj not in cat_collection.objects:
            for collection in list(obj.users_collection):
                collection.objects.unlink(obj)
            cat_collection.objects.link(obj)

    # Camera and lighting for a useful immediate preview.
    bpy.ops.object.camera_add(location=(4.8, -10.5, 4.0))
    camera = bpy.context.object
    camera.name = "Cat Camera"
    camera.data.lens = 58
    point_camera_at(camera, (0.0, 0.0, 1.55))
    bpy.context.scene.camera = camera

    bpy.ops.object.light_add(type="AREA", location=(3.5, -5.0, 7.0))
    key = bpy.context.object
    key.name = "Key light"
    key.data.energy = 900
    key.data.shape = "DISK"
    key.data.size = 5.0
    key.rotation_euler = (math.radians(25), 0, math.radians(32))

    bpy.ops.object.light_add(type="AREA", location=(-4.0, -2.0, 3.5))
    fill = bpy.context.object
    fill.name = "Fill light"
    fill.data.energy = 500
    fill.data.size = 4.0
    fill.rotation_euler = (math.radians(70), 0, math.radians(-65))

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = 600
    scene.render.resolution_y = 600
    scene.render.resolution_percentage = 100
    scene.world.color = (0.025, 0.015, 0.012)

    # Select the cat parts, leaving camera and lights unselected.
    bpy.ops.object.select_all(action="DESELECT")
    for obj in cat_collection.objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = bpy.data.objects.get("Head")


if __name__ == "__main__":
    create_cat()
