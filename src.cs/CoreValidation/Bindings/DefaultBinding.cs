using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace CoreValidation.Bindings
{
  public interface IStateBinding
  {
    Dictionary<string, object> Errors { get; set; }
    Dictionary<string, object> State { get; set; }
  }

  public interface IReflectBinding
  {
    Dictionary<string, object> Errors { get; set; }
  }

  public class DefaultBinding : AbstractBinding
  {
    readonly Type _type;

    public DefaultBinding(Type type) => _type = type;

    public override IDictionary<string, object> GetErrors(object source)
    {
      if (source is IStateBinding s)
        return s.Errors;
      else if (source is IReflectBinding r)
        return r.Errors;
      throw new InvalidOperationException("Binding not found");
    }

    public override IDictionary<string, object> GetState(object source, object opts)
    {
      if (source is IStateBinding s)
        return s.State;
      else if (source is IReflectBinding r)
        return null;
      throw new InvalidOperationException("Binding not found");
    }

    public override void SetErrors(object source, IDictionary<string, object> errors)
    {
      if (source is IStateBinding s)
        s.Errors = (Dictionary<string, object>)errors;
      else if (source is IReflectBinding r)
        r.Errors = (Dictionary<string, object>)errors;
      else
        throw new InvalidOperationException("Binding not found");
    }

    public override void SetState(object source, object opts, IDictionary<string, object> state)
    {
      if (source is IStateBinding s)
        s.State = (Dictionary<string, object>)state;
      else if (source is IReflectBinding r) { }
      else
        throw new InvalidOperationException("Binding not found");
    }
  }
}
